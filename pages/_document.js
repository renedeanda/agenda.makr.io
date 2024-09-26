import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon */}
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

          {/* Primary Meta Tags */}
          <meta name="title" content="Meeting Agenda Planner | agenda.makr.io" />
          <meta name="description" content="Efficiently plan and manage your meeting agendas with our easy-to-use tool at agenda.makr.io" />

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

          {/* Theme Color for mobile browsers */}
          <meta name="theme-color" content="#6366f1" />

          {/* Viewport for responsive design */}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

          {/* Google Analytics */}
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;