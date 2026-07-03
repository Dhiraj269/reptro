import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Reptro - Campus Delivery App | GEC Arwal',
  description = 'Order groceries, snacks, medicines & essentials online at GEC Arwal. Fast 10-minute delivery, student prices, free morning sprouts!',
  keywords = 'reptro, campus delivery, GEC Arwal, grocery delivery, student essentials',
  image = 'https://reptro.in/images/og-image.png',
  url = 'https://reptro.in/',
  type = 'website',
  productData = null
}) => {
  const fullTitle = title.includes('Reptro') ? title : `${title} | Reptro`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Reptro" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Product Schema (if product page) */}
      {productData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": productData.name,
            "image": productData.image,
            "description": productData.description,
            "brand": {
              "@type": "Brand",
              "name": productData.shopOwner || "Reptro"
            },
            "offers": {
              "@type": "Offer",
              "url": url,
              "priceCurrency": "INR",
              "price": productData.price,
              "availability": productData.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Reptro"
              }
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;