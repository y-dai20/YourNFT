import MintIpfsNFTForm from "../components/form/MintIpfsNFTForm";
import Layout from "../components/layout/Layout";
import { useWallet } from "@/hooks/useWallet";
import { useYourNFTContract } from "@/hooks/useYourNFTContract";
import RequireWallet from "@/components/layout/RequireWallet";
import NFTCard from "@/components/card/NFTCard";
import ExchangeRequestCard from "@/components/card/ExchangeRequestCard";
import RequestExchangeForm from "@/components/form/RequestExchangeForm";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Button } from "react-bootstrap";

export default function Home() {
  const { currentAccount, connectWallet } = useWallet();
  const {
    processing,
    mintIpfsNFT,
    NFTAttributes,
    requestExchange,
    Exchanges,
    accept,
    deny,
  } = useYourNFTContract({
    currentAccount: currentAccount,
  });

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        <MintIpfsNFTForm
          mintIpfsNFT={(
            name: string,
            description: string,
            imageURL: string
          ) => {
            mintIpfsNFT({ name, description, imageURL });
          }}
        ></MintIpfsNFTForm>
      </RequireWallet>
      <Tabs>
        <TabList>
          <Tab>NFT</Tab>
          <Tab>ExchangeRequest</Tab>
        </TabList>
        <TabPanel>
          <div className="nftCardList">
            {NFTAttributes.map((NFTAttribute, index) => {
              return (
                <div key={index} className="nftCard">
                  <NFTCard NFTAttribute={NFTAttribute} index={index}>
                    {currentAccount != NFTAttribute.owner && (
                      <RequestExchangeForm
                        index={index}
                        requestExchange={(
                          sendTokenId: number,
                          receiveTokenId: number,
                          text: string
                        ) => {
                          requestExchange({
                            sendTokenId,
                            receiveTokenId,
                            text,
                          });
                        }}
                      ></RequestExchangeForm>
                    )}
                  </NFTCard>
                </div>
              );
            })}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="exchangeRequestList">
            {Exchanges.map((Exchange, index) => {
              return (
                <div key={index} className="exchangeRequestCard">
                  <ExchangeRequestCard ExchangeRequest={Exchange}>
                    {currentAccount == Exchange.receiver &&
                      !Exchange.isDone && (
                        <>
                          <Button
                            variant="success"
                            onClick={() => accept(index)}
                          >
                            Accept
                          </Button>
                          <Button variant="danger" onClick={() => deny(index)}>
                            Deny
                          </Button>
                        </>
                      )}
                  </ExchangeRequestCard>
                </div>
              );
            })}
          </div>
        </TabPanel>
      </Tabs>
    </Layout>
  );
}
