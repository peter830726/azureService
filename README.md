## 包裝 azure 一系列服務為套件
azure storage sdk https://github.com/Azure/azure-storage-node
azure tts text to speech 服務
將文字轉換為語音後,上傳至 azure 的 storage
也可以自行call client 做 CRUD,
此套件主要是將 tts 的服務與storage 做結合
    
    import { equal } from "assert";
    import Client from "../lib/client";

    const client = new Client({
        bingApiSubscriptionKey: "your_bingApiSubscriptionKey",
        storageAccount: "your_storageAccount",
        storageAccessKey: "your_storageAccessKey",
        cdnDomain: "your_cdnDomain"
    });

    describe("client", () => {
        it("getUrl", () => {
            let container = "test_container",
                fileName = "test_fileName";

            let url = client.generateCdnFileUrl(container, fileName);

            equal(`https://${client.config.cdnDomain}.azureedge.net/${container}/${fileName}.mp3`, url);
        });

        it("textToSpeechAndUpdateToStorage", () => {
            let container = "test_container",
                fileName = "test_text_Id",
                text = "這是要翻譯成語音的文字";

            client.textToSpeech({
                text: text,
                volume: "+50%",
                rate: "+50%",
                soundPerson: "HanHanRUS"
            }, container, fileName).then((url: string) => {
                equal(url, client.generateCdnFileUrl(container, fileName));
            });
        });
    })
