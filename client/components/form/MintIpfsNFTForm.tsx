import styles from "./Form.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Web3Storage } from "web3.storage";
import { useForm } from "react-hook-form";

type Props = {
  mintIpfsNFT: (name: string, description: string, imageURL: string) => void;
};

type Input = {
  name: string;
  description: string;
};

export default function MintIpfsNFTForm({ mintIpfsNFT }: Props) {
  const [imageURLValue, setImageURLValue] = useState<string>("");

  const WEB3_STORAGE_API_KEY = process.env.WEB3_STORAGE_API_KEY;
  async function imageToNFT(image: any) {
    const client = new Web3Storage({ token: WEB3_STORAGE_API_KEY });
    console.log(image);

    const rootCid = await client.put(image.files, {
      name: "upload",
      maxRetries: 3,
    });

    const res = await client.get(rootCid);
    const files = await res?.files();

    if (files?.length !== 0) {
      const file = files[0];
      console.log("file.cid: ", file.cid);
      setImageURLValue(file.cid);
    }
  }

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>();

  const onSubmit = (data: Input) => {
    mintIpfsNFT(data.name, data.description, imageURLValue);
    reset();
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.title}>Mint NFT</div>
        <div className="form-group">
          <label>Name</label>
          <br></br>
          <input
            type="text"
            placeholder="name"
            {...register("name", {
              required: "required",
            })}
          />
          {errors.name?.message && (
            <p className={styles.errorMessage} role="alert">
              {errors.name?.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <br></br>
          <input
            type="text"
            placeholder="description"
            {...register("description", {
              required: "required",
            })}
          />
          {errors.description?.message && (
            <p className={styles.errorMessage} role="alert">
              {errors.description?.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Image</label>
          <br></br>
          <input
            type="file"
            name="imageURL"
            placeholder="imageURL"
            accept=".jpg , .jpeg , .png"
            onChange={(e) => imageToNFT(e.target)}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3 p-1">
          Mint
        </button>
      </form>
    </div>
  );
}
