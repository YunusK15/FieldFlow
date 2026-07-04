import urllib.request
import xml.etree.ElementTree as ET
import json
import re
import email.utils
import datetime

def clean_html(text):
    # Remove HTML tags (like <a>, <p>, <img>, etc.)
    clean = re.sub(r'<[^<]+?>', '', text)
    # Decode common HTML entities
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'").replace('&#8217;', "'").replace('&#8220;', '"').replace('&#8221;', '"')
    return clean

def scrape_source(source_name, url):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    import ssl
    ssl_context = ssl._create_unverified_context()
    
    articles = []
    try:
        # Set a 3-second timeout and bypass SSL verification to prevent hanging on expired certs
        with urllib.request.urlopen(req, timeout=3, context=ssl_context) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        for item in items[:4]:  # Take latest 4 items from each source
            title = item.find('title').text if item.find('title') is not None else 'No Title'
            title = clean_html(title).strip()
            
            link = item.find('link').text if item.find('link') is not None else ''
            
            description_node = item.find('description')
            description_text = ''
            if description_node is not None and description_node.text:
                description_text = clean_html(description_node.text).strip()
            
            # Format description
            if len(description_text) > 300:
                description_text = description_text[:297] + '...'
            elif not description_text:
                description_text = 'No summary description available.'
                
            pub_date = item.find('pubDate').text if item.find('pubDate') is not None else ''
            
            # Parse date string for sorting
            timestamp = 0
            try:
                dt = email.utils.parsedate_to_datetime(pub_date)
                timestamp = dt.timestamp()
                date_str = dt.strftime('%d %b %Y')
            except Exception:
                # Fallback parser if standard RFC 2822 fails
                date_match = re.search(r'\d{1,2}\s+[A-Za-z]{3}\s+\d{4}', pub_date)
                date_str = date_match.group(0) if date_match else 'Recent'
                timestamp = datetime.datetime.now().timestamp()
            
            tagline = f"Source: {source_name} • Published {date_str}"
            
            # Generate benefits dynamically from description
            sentences = [s.strip() for s in re.split(r'[.!?]', description_text) if len(s.strip()) > 10]
            benefits = []
            for s in sentences:
                if len(benefits) < 3 and 15 < len(s) < 90:
                    benefits.append(s[0].upper() + s[1:])
            
            # Fallbacks if we can't extract clean sentences
            if len(benefits) < 1:
                benefits.append("Explore the complete coverage and in-depth report on this innovation.")
            if len(benefits) < 2:
                benefits.append("Understand key commercial applications for modern farming operations.")
            if len(benefits) < 3:
                benefits.append("Read more details by visiting the full source link.")
                
            articles.append({
                "title": title,
                "tagline": tagline,
                "description": description_text,
                "benefits": benefits,
                "icon": "📰",
                "sourceUrl": link,
                "timestamp": timestamp
            })
    except Exception as e:
        # Log error to stderr, but don't crash the whole script
        import sys
        print(f"Error scraping {source_name}: {e}", file=sys.stderr)
        
    return articles

def scrape_all():
    sources = [
        {"name": "AgFunderNews", "url": "https://agfundernews.com/feed"},
        {"name": "PrecisionAg", "url": "https://www.precisionag.com/feed/"},
        {"name": "SeedWorld", "url": "https://seedworld.com/feed/"},
        {"name": "SuccessfulFarming", "url": "https://www.agriculture.com/rss/technology"},
        {"name": "AgriPulse", "url": "https://www.agri-pulse.com/rss/articles"}
    ]
    
    all_articles = []
    for src in sources:
        articles = scrape_source(src["name"], src["url"])
        all_articles.extend(articles)
        
    # Sort all gathered articles by timestamp descending (newest first)
    all_articles.sort(key=lambda x: x["timestamp"], reverse=True)
    
    # Remove the temporary timestamp field and limit to top 8 items
    formatted_articles = []
    for art in all_articles[:8]:
        del art["timestamp"]
        formatted_articles.append(art)
        
    print(json.dumps(formatted_articles))

if __name__ == "__main__":
    scrape_all()
