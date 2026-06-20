<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap - Sky's the Limit Painting LLC</title>
        <style>
          body {
            background-color: #050505;
            color: #F7F7F7;
            font-family: "Satoshi", "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 40px 24px;
            min-height: 100vh;
            box-sizing: border-box;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          header {
            border-bottom: 2px solid #FF5A00;
            padding-bottom: 24px;
            margin-bottom: 32px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 16px;
          }
          .logo-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          h1 {
            font-family: "Satoshi", "Oswald", sans-serif;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #F7F7F7;
          }
          .tag {
            background-color: #FF5A00;
            color: #050505;
            display: inline-block;
            align-self: flex-start;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }
          .stats {
            color: #9CA3AF;
            font-size: 14px;
            font-weight: 500;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            margin-top: 16px;
          }
          th {
            background-color: #111111;
            color: #FF5A00;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 16px;
            border-bottom: 1px solid #1F2937;
          }
          tr {
            border-bottom: 1px solid #111111;
            transition: background-color 0.15s cubic-bezier(0.32, 0.72, 0, 1);
          }
          tr:hover {
            background-color: #111111;
          }
          td {
            padding: 16px;
            font-size: 14px;
            color: #F7F7F7;
          }
          a {
            color: #F7F7F7;
            text-decoration: none;
            transition: color 0.15s cubic-bezier(0.32, 0.72, 0, 1);
          }
          a:hover {
            color: #FF5A00;
          }
          .priority-high {
            color: #FF5A00;
            font-weight: 700;
          }
          .footer {
            margin-top: 64px;
            border-top: 1px solid #1F2937;
            padding-top: 24px;
            color: #9CA3AF;
            font-size: 12px;
            text-align: center;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="logo-area">
              <span class="tag">XML Sitemap</span>
              <h1>SKY'S THE LIMIT PAINTING</h1>
            </div>
            <div class="stats">
              Total Discovered Pages: <xsl:value-of select="count(s:urlset/s:url)"/>
            </div>
          </header>
          
          <table>
            <thead>
              <tr>
                <th>Location URL</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td>
                    <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                  </td>
                  <td><xsl:value-of select="s:lastmod"/></td>
                  <td><xsl:value-of select="s:changefreq"/></td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="s:priority = '1.0'">
                        <span class="priority-high">1.0</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <xsl:value-of select="s:priority"/>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <div class="footer">
            Registered MN Specialty Contractor (ID: IR816596) | Owner exempt from workers' comp under MN Statute 176.041 | Fully Insured
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
