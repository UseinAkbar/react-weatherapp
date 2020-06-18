import React from 'react';
import ReactLoading from 'react-loading';



  export default function Load() {

    return (<div className="box-load">
      <ReactLoading type={'spin'} color={'#eaf6f6'} width={'60px'} height={'60px'} />
    </div>)
  }
