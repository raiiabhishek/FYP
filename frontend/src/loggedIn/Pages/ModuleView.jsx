import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import Sidebar from "../Components/SideBar";

export default function ModuleView() {
  const { moduleId } = useParams();
  const { authToken, role } = useContext(AuthContext);
  const [module, setModule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await axios.get(
          `${api}/modules/getModule/${moduleId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response);
        setModule(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred while fetching module.");
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);
  return (
    <div className="min-h-screen">
      <div className="lg:flex">
        <Sidebar />
        <div></div>
      </div>
    </div>
  );
}
