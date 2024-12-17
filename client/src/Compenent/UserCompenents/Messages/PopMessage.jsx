import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

export default function PopMessage({show, close, message}) {
    if(!show){
        return null;
    }
  return (
    <>
      <MDBModal open={show} tabIndex='-1' onClose={close}>
        <MDBModalDialog size="lg" scrollable>
          <MDBModalContent>
            <MDBModalHeader className="d-flex justify-content-center">
              <MDBBtn
                    className='btn-close'
                    color='none'
                    onClick={close}
                    style={{ position: 'absolute', right: '1rem' }}
                  />
              <MDBModalTitle className="modal-title mx-auto" style={{ padding: '5px 10px', borderRadius: '5px' }}>
                {message.title}
              </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>{message.message}{message.id}</MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}




 

