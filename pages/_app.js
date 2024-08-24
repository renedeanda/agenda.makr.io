import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Meeting Agenda Planner | agenda.makr.io</title>
        <meta name="description" content="Efficiently plan and manage your meeting agendas with our easy-to-use tool at agenda.makr.io" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agenda.makr.io/" />
        <meta property="og:title" content="Meeting Agenda Planner | agenda.makr.io" />
        <meta property="og:description" content="Efficiently plan and manage your meeting agendas with our easy-to-use tool at agenda.makr.io" />
        <meta property="og:image" content="https://agenda.makr.io/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://agenda.makr.io/" />
        <meta property="twitter:title" content="Meeting Agenda Planner | agenda.makr.io" />
        <meta property="twitter:description" content="Efficiently plan and manage your meeting agendas with our easy-to-use tool at agenda.makr.io" />
        <meta property="twitter:image" content="https://agenda.makr.io/twitter-image.jpg" />
      </Head>

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

// Custom event tracking function
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export default MyApp;