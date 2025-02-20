// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract StudentCertificate {

    struct ModuleGrade {
        string moduleName;
        uint8 obtainedGrade;
        uint8 fullMarks;
        uint8 passingGrade;
    }

    struct Certificate {
        string studentName;
        string courseName;
        string issueDate;
        ModuleGrade[] moduleGrades;
        uint8 finalGrade;
        string certificateId;
    }

    mapping(string => mapping(string => Certificate)) public certificates; // Map course name => certificate ID => certificate
    address public issuer; // Address that can issue certificate

    event CertificateIssued(string courseName, string certificateId);

    constructor() {
        issuer = msg.sender;
    }

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only the issuer can call this function.");
        _;
    }

   function issueCertificate(
        string memory _courseName,
        string memory _studentName,
        string memory _issueDate,
        ModuleGrade[] memory _moduleGrades,
        uint8 _finalGrade,
        string memory _certificateId
    ) public onlyIssuer {
        require(bytes(certificates[_courseName][_certificateId].studentName).length == 0, "Certificate already issued with this ID for this course");
          
        Certificate storage newCertificate = certificates[_courseName][_certificateId];

        newCertificate.studentName = _studentName;
        newCertificate.courseName = _courseName;
        newCertificate.issueDate = _issueDate;
        newCertificate.finalGrade = _finalGrade;
        newCertificate.certificateId = _certificateId;

        // Copy elements from the memory array to storage array
        for (uint i = 0; i < _moduleGrades.length; i++) {
            newCertificate.moduleGrades.push(_moduleGrades[i]);
         }

        emit CertificateIssued(_courseName, _certificateId);
    }

    function getCertificate(string memory _courseName, string memory _certificateId)
        public
        view
        returns (
            string memory studentName,
            string memory courseName,
            string memory issueDate,
            ModuleGrade[] memory moduleGrades,
            uint8 finalGrade,
            string memory certificateId,
             bool found
        )
    {
        if (bytes(certificates[_courseName][_certificateId].studentName).length == 0) {
            return ("", "", "", new ModuleGrade[](0), 0, "", false);
        }

        Certificate storage cert = certificates[_courseName][_certificateId];
        ModuleGrade[] memory returnModuleGrades = new ModuleGrade[](cert.moduleGrades.length);
        for (uint i = 0; i < cert.moduleGrades.length; i++) {
            returnModuleGrades[i] = cert.moduleGrades[i];
        }
        return (
            cert.studentName,
            cert.courseName,
            cert.issueDate,
            returnModuleGrades,
            cert.finalGrade,
            cert.certificateId,
            true
        );
    }

    // Function to update issuer
    function updateIssuer(address _newIssuer) public onlyIssuer {
        issuer = _newIssuer;
    }
}