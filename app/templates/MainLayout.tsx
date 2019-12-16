import Head from 'next/head';

const MainLayout = ( { children }) => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <title>TodoList</title>
      <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet" />
    </Head>
    <div>
      {children}
      <footer>
        Built with KeystoneJS.{' '}
        <a href="/admin">
          Go to Admin Console
        </a>
      </footer>
    </div>
  </>
);

export default MainLayout;
