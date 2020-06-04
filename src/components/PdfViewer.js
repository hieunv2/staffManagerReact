import React, {useState, useRef} from 'react';

import Loading from './Loading';
//-------------------------------------

const PdfViewer = React.memo(({uri}) => {
  const [width, setWidth] = useState(595);
  const ref = useRef();

  const onDocumentLoadSuccess = () => {
    setWidth(ref.current.offsetWidth);
  };

  return (
    <Document
      inputRef={ref}
      file={uri}
      loading={<Loading />}
      onLoadSuccess={onDocumentLoadSuccess}>
      <Page size="A4" width={width} pageNumber={1} />
    </Document>
  );
});

export default PdfViewer;
