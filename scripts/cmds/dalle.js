const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const KievRPSSecAuth = "FABaBBRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACKs9o8y2joX3GARzPCawVId+t3m+A1oT0Z8ZKWZxM1BkSRF2FvXcMl7+FJwHOjtPTS1QthwiVJ34RvmB/PaDEFFwqPE4w0lV/oNkTF+/r6B4e4cyoRXWDxlUU6QcQZKDLR3/kkmw6ucLw7N2VbDtfp8+UXRxb4sP6ScUhdGzj3A3sYkS5uzFKtSVLEFPxl11/nk0/Ji42V/aofCjH0yzmhQkQeaf4FNEPal+H4rj7zFIvnH3sRSXw2VhRAMkBbGeE9ii/08QWQrnLIC1j938sutwJlfUaehXwstPmTXJaV4z5XswfV1fpc69qKru44YgdJYIOypKb1cdSu5bs2Lse61vOXrrRI5EbiQ8H9xY9UXAINvup4dKMk8tkBXSjgjVRNBpu8N8Yc/GJkAWjIzTuw2m/06BIWq9bzOAJlNuWw7Oysr9kUX78V1xcQ9Ly/q+PaUGTLvdYnieQBOY5I6e/LcXfkuHA1JrPn9lgGdmyFN3d2ECCzesKPCcRr7QdsviXFLQN0sWpmUHM6WqhL8A1o548GuVvQX5+XlXcHdOYw+5nHHEk8IUb2op4vqmU83svv3RaGyjE7Bt3toTxsc2z7i/Gb0CtAvVV2kbcaDjHgOgZEAXVSbtlOyvuBPKtAIEqTVGO6+7U2hpYzWFER8fFxG3NWsDyBG8ITVNxCv6XKFew3QwGI+b3FNCn8jo+qwSz3UnK8PM/pjZb4cOAAR30+hDXRw1YNyRdJmkpcuAZHfImrUeFqvPpx483LNk3con1R1t41DBEF72e5mCmOi2zdlSgU32Yd5WKvwhH6sj/zY5DcDUXXAm7G0nLhocRvnU1YG0k0ngT6wkfdiolu0dDmGbTYlBe7oyytgi7Lxb/d9JH+hjIxLlg5UmZEK9QCLVfLyAx8FZerO6HIx+lCZfmeQJvGyl+0oRxvaGmEvWVz//TVcpCcmeyZ5eEQ1Z/zC5uJLJTeYOHw2WcjNwIEQQeAoOKNW2gJV9tr1YWwmoVTZZPz4VixCVct6pqiX+BbdKH5PnkqlG4pfRIQY+v2vQ/oz5V2yC/ZME4xT49h9GEbF8OLPrwjvSk4vUrzOk9kAdlzemBy9D5q08US8mVF+qk7QTnXizj8TTCl65KeuNJ6jU0VZ4plMB4ODJjQA+3PauzoIU98+T9fZYviDvxkOumf4saYmb2Cf7ioj+0BBonYyaH2NrwUZvvXBZ8wQbwyZiJ5PRSyvYTIS00+227W8qDT91H1+GvmNqsTKxEmAYsOs+WOSL2BXhBQpU6mYYiHKkpQqvJqMRbdSoyATzxCeR17EVUpba+1RqEs3tax5yZ+fodDn7AqJzk5gtKRHeRZb8kwIf+znqenXWXhiC8i84PbKV48asXc3Ql2ssg+5c5j4UqmE6mQDeVEYYWqrU/lzX1JiqFACuM3Mdu4ezDx5w4MqoEhewYxZLzQ==";
const _U = "1o64On4-C_EaOJItB0FiVAZvf2pCVjk-7dH3NpQG9RC1PQS6cVVmIXSlUKAjgGQVA6fIClLh_wbH9e0pD8QOqm68EoreADHCJKqJ2GETzcZGcfS18LxodihBb2vagZsB7WNvw-Vy4Dd9p8oPl0DSNmMwlwczpy2EWQQNYQZfgC3JT3dpGyvuTRoQRSExzoSG_Re-VkJmJkBU_kjhxzjCLMg";

module.exports = {
  config: {
    name: "dalle",
    aliases: ["dalle3"],
    version: "1.0.2",
    author: "Samir Œ ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "dalle"
    },
    longDescription: {
      en: ""
    },
    category: "dalle",
    guide: {
      en: "{prefix}dalle <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {
    const uid = event.senderID;
    const permission = [`${uid}`]; 

    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        "You don't have enough permission to use this command. Only admin can do it.",
        event.threadID,
        event.messageID
      );
      return;
    }

    const keySearch = args.join(" ");
    const indexOfHyphen = keySearch.indexOf('-');
    const keySearchs = indexOfHyphen !== -1 ? keySearch.substr(0, indexOfHyphen).trim() : keySearch.trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 4;

    try {
      const res = await axios.get(`https://api-dalle-gen.onrender.com/dalle3?auth_cookie_U=${_U}&auth_cookie_KievRPSSecAuth=${KievRPSSecAuth}&prompt=${encodeURIComponent(keySearchs)}`);
      const data = res.data.results.images;

      if (!data || data.length === 0) {
        api.sendMessage("No images found for the provided query.", event.threadID, event.messageID);
        return;
      }

      const imgData = [];
      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i].url, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
        body: `Here's your generated image`
      }, event.threadID, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("cookie of the command. Is expired", event.threadID, event.messageID);
    } finally {
      await fs.remove(path.join(__dirname, 'cache'));
    }
  }
};
