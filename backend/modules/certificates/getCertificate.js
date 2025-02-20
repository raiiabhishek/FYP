const { Web3 } = require("web3");
const contractJSON = require("../../contractABI.json");
const web3 = new Web3(process.env.INFURA_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractJSON, contractAddress);
const privateKey = process.env.PRIVATE_KEY;
const issuer = web3.eth.accounts.privateKeyToAccount(privateKey);
const getCertificate = async (req, res) => {
  try {
    console.log("invoked");
    const { courseName, certificateId } = req.params;
    const result = await contract.methods
      .getCertificate(courseName, certificateId)
      .call();

    const studentName = result[0];
    const fetchedCourseName = result[1];
    const issueDate = result[2];
    const fetchedModuleGrades = result[3];
    const finalGrade = result[4];
    const fetchedCertificateId = result[5];
    const found = result[6];

    if (!found) {
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    }

    const formattedModuleGrades = fetchedModuleGrades.map((grade) => ({
      moduleName: grade.moduleName,
      obtainedGrade: parseInt(grade.obtainedGrade),
      fullMarks: parseInt(grade.fullMarks),
      passingGrade: parseInt(grade.passingGrade),
    }));

    res.status(200).send({
      status: "success",
      certificate: {
        studentName,
        courseName: fetchedCourseName,
        issueDate,
        moduleGrades: formattedModuleGrades,
        finalGrade: parseInt(finalGrade),
        certificateId: fetchedCertificateId,
      },
    });
  } catch (error) {
    console.error("Error getting certificate:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get certificate",
    });
  }
};
module.exports = getCertificate;
