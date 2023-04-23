import React, { useState } from "react";
import { Modal as BootstrapModal } from "react-bootstrap";
import Button from "react-bootstrap/Button";

type Props = {
  title?: string;
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ title, header, body, footer }: Props) {
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        {title}
      </Button>
      <BootstrapModal show={show} onHide={handleClose}>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>{header}</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>{body}</BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {footer}
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}
