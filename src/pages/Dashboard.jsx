import FileUploader from "../components/FileUploder/FileUploader";
import Navbar from "../components/Navbar/Navbar";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <FileUploader />
      </div>
    </>
  );
};

export default Dashboard;
