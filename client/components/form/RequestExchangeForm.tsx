import Modal from "@/components/modal/Modal";
import Button from "react-bootstrap/Button";
import styles from "./Form.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  index: number;
  requestExchange: (
    sendTokenId: number,
    receiveTokenId: number,
    text: string
  ) => void;
};

type Input = {
  sendTokenId: number;
  text: string;
};

export default function RequestExchangeForm({ index, requestExchange }: Props) {
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>();

  const onSubmit = (data: Input) => {
    requestExchange(data.sendTokenId, index, data.text);
    console.log(data);
    reset();
  };

  return (
    <Modal
      title="RequestExchange"
      header={<p>RequestExchange</p>}
      body={
        <div className={styles.container}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Receive Token Id</label>
              <br></br>
              <input
                type="number"
                name="receiveTokenId"
                value={index}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Send Token Id</label>
              <br></br>
              <input
                type="text"
                placeholder="number"
                {...register("sendTokenId", {
                  required: "required",
                  pattern: { value: /[0-9]+/gi, message: "only digit" },
                })}
              />
              {errors.sendTokenId?.message && (
                <p className={styles.errorMessage} role="alert">
                  {errors.sendTokenId?.message}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Text</label>
              <br></br>
              <input
                type="text"
                placeholder="Exchange me"
                {...register("text", { required: "required" })}
              />
              {errors.text?.message && (
                <p className={styles.errorMessage} role="alert">
                  {errors.text?.message}
                </p>
              )}
            </div>
            <Button variant="primary" type="submit" className="mt-3 p-1">
              Request
            </Button>
          </form>
        </div>
      }
    ></Modal>
  );
}
