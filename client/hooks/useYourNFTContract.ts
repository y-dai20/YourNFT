import { getEthereum } from "@/utils/ethereum";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "../utils/YourNFT.json";
import { YourNFT as YourNFTType } from "../typechain-types";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = abi.abi;

type PropsUseYourNFTContract = {
  currentAccount: string | undefined;
};

type PropsMintIpfsNFT = {
  name: string;
  description: string;
  imageURL: string;
};

type PropsRequextExchange = {
  sendTokenId: number;
  receiveTokenId: number;
  text: string;
};

type Exchange = {
  sendTokenId: number;
  sender: string;
  receiveTokenId: number;
  receiver: string;
  text: string;
  timestamp: number;
  isDone: boolean;
};

type NFTAttribute = {
  name: string;
  description: string;
  imageURL: string;
  owner: string;
};

type ReturnUseYourNFTContract = {
  processing: boolean;
  NFTAttributes: NFTAttribute[];
  Exchanges: Exchange[];
  mintIpfsNFT: (props: PropsMintIpfsNFT) => void;
  requestExchange: (props: PropsRequextExchange) => void;
  accept: (index: number) => void;
  deny: (index: number) => void;
};

export const useYourNFTContract = ({
  currentAccount,
}: PropsUseYourNFTContract): ReturnUseYourNFTContract => {
  const [processing, setProcessing] = useState<boolean>(false);

  const [yourNFTContract, setYourNFTContract] = useState<YourNFTType>();

  const [owner, setOwner] = useState<string>();
  const [Exchanges, setExchanges] = useState<Exchange[]>([]);
  const [NFTAttributes, setNFTAttributes] = useState<NFTAttribute[]>([]);
  const [totalTokensNum, setTotalTokensNum] = useState<number>(0);
  const [maxMintNFTNum, setMaxMintNFTNum] = useState<number>(0);

  const ethereum = getEthereum();

  async function getYourNFTContract() {
    try {
      if (ethereum) {
        // @ts-ignore: ethereum as ethers.providers.ExternalProvider
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const YourNFTContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        ) as YourNFTType;
        setYourNFTContract(YourNFTContract);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function setContractParameter() {
    if (!yourNFTContract) return;
    try {
      let txn = await yourNFTContract.getTotalTokens();
      setTotalTokensNum(txn.toNumber());
      txn = await yourNFTContract.maxMintNFT();
      setMaxMintNFTNum(txn.toNumber());
    } catch (error) {
      console.log(error);
    }
  }

  async function mintIpfsNFT({
    name,
    description,
    imageURL,
  }: PropsMintIpfsNFT) {
    if (!yourNFTContract) return;
    try {
      console.log("Going to pop wallet now to pay gas...");
      let txn = await yourNFTContract.mintIpfsNFT(name, description, imageURL);
      console.log("Mining...please wait.");
      await txn.wait();
      console.log(
        `Mined, see transaction: https://sepolia.etherscan.io/tx/${txn.hash}`
      );
      let txn2 = await yourNFTContract.getTotalTokens();
      setTotalTokensNum(txn2.toNumber());
    } catch (error) {
      console.log(error);
    }
  }

  async function getNFTAttributes() {
    if (!yourNFTContract) return;
    try {
      let _NFTAttributes: NFTAttribute[] = [];
      for (let i = 0; i < totalTokensNum; i++) {
        let txn = await yourNFTContract.NFTAttributes(i);
        let owner = await yourNFTContract.ownerOf(i);
        _NFTAttributes.push({
          name: txn.name,
          description: txn.description,
          imageURL: txn.imageURL,
          owner: owner.toLowerCase(),
        });
      }
      setNFTAttributes(_NFTAttributes);
    } catch (error) {
      console.log(error);
    }
  }

  async function getExchanges() {
    if (!yourNFTContract) return;
    try {
      const exchanges = await yourNFTContract.getExchanges();
      const _Exchanges: Exchange[] = exchanges.map((exchange) => {
        return {
          sendTokenId: exchange.sendTokenId.toNumber(),
          sender: exchange.sender.toLowerCase(),
          receiveTokenId: exchange.receiveTokenId.toNumber(),
          receiver: exchange.receiver.toLowerCase(),
          text: exchange.text,
          timestamp: exchange.timestamp.toNumber(),
          isDone: exchange.isDone,
        };
      });
      setExchanges(_Exchanges);
    } catch (error) {
      console.log(error);
    }
  }

  async function requestExchange({
    sendTokenId,
    receiveTokenId,
    text,
  }: PropsRequextExchange) {
    if (!yourNFTContract) return;
    try {
      console.log("Going to pop wallet now to pay gas...");
      let txn = await yourNFTContract.requestExchange(
        sendTokenId,
        receiveTokenId,
        text
      );
      console.log("Request Exchange...please wait.");
      await txn.wait();
      console.log(
        `Requested Exchange, see transaction: https://sepolia.etherscan.io/tx/${txn.hash}`
      );
      getExchanges();
    } catch (error) {
      console.log(error);
    }
  }

  async function accept(index: number) {
    if (!yourNFTContract) return;
    try {
      console.log("Going to pop wallet now to pay gas...");
      const txn = await yourNFTContract.accept(index);
      console.log("Accept Exchange...please wait.");
      await txn.wait();
      console.log(
        `Accepted Exchange, see transaction: https://sepolia.etherscan.io/tx/${txn.hash}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function deny(index: number) {
    if (!yourNFTContract) return;
    try {
      console.log("Going to pop wallet now to pay gas...");
      const txn = await yourNFTContract.deny(index);
      console.log("Deny Exchange...please wait.");
      await txn.wait();
      console.log(
        `Denied Exchange, see transaction: https://sepolia.etherscan.io/tx/${txn.hash}`
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getYourNFTContract();
    setContractParameter();
    getExchanges();
  }, [currentAccount, ethereum]);

  useEffect(() => {
    getNFTAttributes();
  }, [totalTokensNum]);

  return {
    processing,
    mintIpfsNFT,
    NFTAttributes,
    requestExchange,
    Exchanges,
    accept,
    deny,
  };
};
