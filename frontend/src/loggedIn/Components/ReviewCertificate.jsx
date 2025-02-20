import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import Nav from "../../Nav";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 24,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  moduleText: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "left",
  },
  moduleSection: {
    marginTop: 20,
  },
  finalGrade: {
    marginTop: 10,
    fontSize: 14,
    textAlign: "left",
  },
});

const MyDocument = ({ cert }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Certificate of Completion</Text>
      <Text style={styles.text}>
        {`This is to certify that ${cert.studentName} has successfully completed the course ${cert.courseName}`}
      </Text>
      <Text style={styles.text}>
        {`Completion Date: ${new Date().toLocaleDateString()}`}
      </Text>
      <View style={styles.moduleSection}>
        <Text style={styles.moduleText}>Module wise grades:</Text>
        {cert.moduleGrades.map((grade) => (
          <Text style={styles.moduleText} key={grade.moduleName}>
            {`Module: ${grade.moduleName}, Obtained Grade: ${grade.obtainedGrade}/${grade.fullMarks}`}
          </Text>
        ))}
      </View>
      <Text style={styles.finalGrade}>{`Final Grade: ${cert.finalGrade}`}</Text>
    </Page>
  </Document>
);

export default function ReviewCertificate() {
  const [searchParams] = useSearchParams();
  const courseName = searchParams.get("courseName");
  const certificateId = searchParams.get("certificateId");
  const api = import.meta.env.VITE_URL;
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        if (courseName && certificateId) {
          const result = await axios.get(
            `${api}/certificates/${courseName}/${certificateId}`
          );
          setCert(result.data.certificate);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch certificate.");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [api, courseName, certificateId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!cert) {
    return <p>No certificate data available.</p>;
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className="h-screen"
    >
      <PDFViewer width="100%" height="100%">
        <MyDocument cert={cert} />
      </PDFViewer>
    </div>
  );
}
