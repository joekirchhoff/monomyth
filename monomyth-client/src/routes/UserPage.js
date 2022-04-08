import { useParams } from 'react-router-dom'

function UserPage() {

  const userID = useParams().userID;

  return (
    <div>
      This is the user page!
      User ID: {userID}
    </div>
  );
}

export default UserPage;
