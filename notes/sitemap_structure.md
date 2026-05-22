# XML Sitemap and Service-Area Mapping 🧬

This document details the website sitemap structure to optimize SEO crawls and map targeted geographic landing pages for Minneapolis, St. Paul, and surrounding municipalities.

---

## 1. Directory Tree & URL Hierarchy 🧬

```
/ (Homepage)
├── /residential (Residential Services Hub)
│   ├── /residential/interior-painting
│   └── /residential/exterior-painting
├── /commercial (Commercial Painting Hub)
│   ├── /commercial/facility-painting
│   └── /commercial/striping-pavement-markings
├── /service-areas (Geographic Service Hub)
│   ├── /service-areas/minneapolis-painting
│   ├── /service-areas/st-paul-painting
│   ├── /service-areas/edina-painting
│   ├── /service-areas/minnetonka-painting
│   └── /service-areas/woodbury-painting
├── /about (Brand, Credentials, and Verification Page)
├── /contact (Contact and Lead Capture Form)
└── /sitemap.xml (Search Engine Sitemap XML)
```

---

## 2. XML Sitemap Specifications 🧬

Below is the standard XML structure mapping the priority and change frequency of our core pages.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Main Pages -->
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/</loc>
    <priority>1.00</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/about</loc>
    <priority>0.80</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/contact</loc>
    <priority>0.80</priority>
    <changefreq>monthly</changefreq>
  </url>

  <!-- Service Hubs -->
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/residential</loc>
    <priority>0.90</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/commercial</loc>
    <priority>0.90</priority>
    <changefreq>weekly</changefreq>
  </url>

  <!-- Geographic Landing Pages -->
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/service-areas/minneapolis-painting</loc>
    <priority>0.80</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/service-areas/st-paul-painting</loc>
    <priority>0.80</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://www.skysthelimitpaintingllc.com/service-areas/edina-painting</loc>
    <priority>0.70</priority>
    <changefreq>monthly</changefreq>
  </url>
</urlset>
```

---

## 3. SEO Metadata Guidelines 🧬
1. **Title Tag Format**: `[Service] in [City], MN | Sky's the Limit Painting LLC`
   * *Example*: `Interior Painting in Minneapolis, MN | Sky's the Limit Painting LLC`
2. **Meta Description**: `Insured, meticulous painting and pavement striping services across Minneapolis and St. Paul. General liability insurance and COI available instantly. Get a free quote today!`
