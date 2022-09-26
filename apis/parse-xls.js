const xlsx = require("node-xlsx").default;
const { default: axios } = require("axios");
const writeXlsxFile = require("write-excel-file/node");
const fs = require("fs");
const path = require("path");

module.exports = {
  test: async (req, res) => {
    try {
      // Parse a file
      const workSheetsFromFile = xlsx.parse(
        path.join(__dirname, "../files/product_list.xlsx")
      );

      let parseData = workSheetsFromFile[0].data;
      parseData.shift();
      let data = [];

      for await (let d of parseData) {
        await axios
          .get(`https://api.storerestapi.com/products/${d}`)
          .then((res) => {
            data.push([{ value: d + "" }, { value: res.data.data.price }]);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }

      const HEADER_ROW = [{ value: "productcode" }, { value: "price" }];

      const xlsData = [HEADER_ROW, ...data];

      const buffer = await writeXlsxFile(xlsData);
      const location = fs.createWriteStream(
        path.join(__dirname, "../files/output.xlsx")
      );
      buffer.pipe(location);

      return res.status(200).json({
        url: "http://localhost:5000/output.xlsx",
        message: "File successfully created",
      });
    } catch (err) {
      console.log("error in parse xls: ", err);
      return res.status(500).json("internal server error");
    }
  },
};
