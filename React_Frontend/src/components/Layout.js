import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
export default props => {
  return (
    <Container style={{ overflowX:'hidden' , overflowY:'hidden' }}>      
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.0/semantic.min.css" />
          <script type="text/javascript">
            function disableBack() {window.history.forward()}
            window.onload = disableBack();
          </script>
      </Head>
      {props.children}
    </Container>
  );
};

