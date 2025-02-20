const mongoose = require("mongoose");
require("dotenv").config();
const { Web3 } = require("web3");
const contractJSON = require("../../contractABI.json");
const web3 = new Web3(process.env.INFURA_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractJSON, contractAddress);
const privateKey = process.env.PRIVATE_KEY;
const issuer = web3.eth.accounts.privateKeyToAccount(privateKey);

const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const createCertificate = async (req, res) => {
  const ResultModel = mongoose.model("Results");
  const ModuleModel = mongoose.model("Modules");
  const UserModel = mongoose.model("User");
  const CourseModel = mongoose.model("Courses");
  try {
    console.log("creating cert");
    const { courseId } = req.body;
    console.log(req.body);
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, error: "Course ID is required" });
    }

    // Fetch course details
    const course = await CourseModel.findById(courseId).lean();
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    // 1. Fetch all students enrolled in the course
    const students = await UserModel.find({
      course: courseId,
      role: "student",
    }).lean();

    if (!students || students.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No students found for this course" });
    }

    // 2. Fetch all modules in the course
    const modules = await ModuleModel.find({ course: courseId }).lean();

    if (!modules || modules.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No modules found for this course" });
    }

    // 3. Iterate through each student and create their certificates

    for (const student of students) {
      const studentResults = await ResultModel.find({
        student: student._id,
        module: { $in: modules.map((module) => module._id) },
      }).lean();
      // prepare moduleGrades struct
      const moduleGrades = studentResults.map((result) => {
        const module = modules.find(
          (module) => module._id.toString() === result.module.toString()
        );
        return {
          moduleName: module.name,
          obtainedGrade: result.obtainedGrade,
          fullMarks: result.fullMarks,
          passingGrade: result.passingGrade,
        };
      });

      // Calculate final Grade if needed (example - avg)
      const totalMarks = studentResults.reduce(
        (sum, result) => sum + result.obtainedGrade,
        0
      );
      const finalGrade =
        moduleGrades.length > 0 ? totalMarks / moduleGrades.length : 0; // Example of a final grade calculation, you can change

      // Create a unique certificate ID (you might want to use a better generation mechanism)
      const certificateId = `${student._id}-${Date.now()}`; // or uuid;
      const certificateUrl = `${process.env.FRONTEND_URL}/review-certificate?courseName=${course.name}&certificateId=${certificateId}`;
      // Generate QR Code as Data URL
      const qrCodeDataURL = await QRCode.toDataURL(certificateUrl);

      const encodedABI = contract.methods
        .issueCertificate(
          course.name,
          student.name,
          new Date().toLocaleDateString(), // use a suitable date
          moduleGrades,
          finalGrade,
          certificateId
        )
        .encodeABI();

      // Estimate Gas
      const gasEstimateBigInt = await web3.eth.estimateGas({
        from: issuer.address,
        to: contract._address,
        data: encodedABI,
      });

      const gasEstimate = Number(gasEstimateBigInt);

      // Get the current gas price
      const gasPriceBigInt = await web3.eth.getGasPrice();
      const gasPrice = Number(gasPriceBigInt);

      const tx = {
        from: issuer.address,
        to: contract._address,
        gas: Math.ceil(gasEstimate * 1.2), // add a buffer
        gasPrice: gasPrice,
        data: encodedABI,
      };
      const signedTx = await issuer.signTransaction(tx);

      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(
        `certificate issued for ${student.name} with receipt ${receipt.transactionHash}`
      );

      // PDF Document Creation
      const doc = new PDFDocument();

      // Store the pdf
      const pdfFileName = `${student._id}.pdf`;

      const pdfPath = path.join(__dirname, "../../public/results", pdfFileName);
      const pdfStream = fs.createWriteStream(pdfPath);
      doc.pipe(pdfStream);

      // Certificate Content
      doc.fontSize(24).text(`Certificate of Completion`, { align: "center" });
      doc
        .fontSize(16)
        .text(
          `This is to certify that ${student.name} has successfully completed the course ${course.name}`,
          { align: "center" }
        );
      doc
        .fontSize(12)
        .text(`Completion Date: ${new Date().toLocaleDateString()}`, {
          align: "center",
        });

      // Add module grades to the pdf
      doc.fontSize(14).text("Module wise grades:", { align: "left" });
      moduleGrades.forEach((grade) => {
        doc
          .fontSize(10)
          .text(
            `Module: ${grade.moduleName}, Obtained Grade: ${grade.obtainedGrade}/${grade.fullMarks}`,
            { align: "left" }
          );
      });
      doc.fontSize(14).text(`Final Grade: ${finalGrade}`, { align: "left" });

      // Add QR Code
      doc.image(qrCodeDataURL, {
        fit: [100, 100],
        align: "center",
        valign: "center",
      });
      doc
        .fontSize(10)
        .text("Scan the QR code to verify certificate", { align: "center" });

      doc.end();

      pdfStream.on("finish", () => {
        console.log(
          `PDF Certificate generated for ${student.name} at ${pdfPath}`
        );
      });
    }
    res.json({
      success: true,
      message: "Certificates issued for all students in the course",
    });
  } catch (error) {
    console.error("Error issuing certificates:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to issue certificates",
    });
  }
};

module.exports = createCertificate;
