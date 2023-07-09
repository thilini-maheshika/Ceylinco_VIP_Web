import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404 Not Found"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back to Home</Button>
        </Link>
      }
    />
  );
};

export default NotFoundPage;
