
import {
  Card,
  Col,
  Row,
  Typography
} from "antd";
import Axios from 'axios';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { getUserrole, logout, getToken } from "../../session";
import config from '../../config';

function Home() {

  const history = useHistory();
  const [isLoading, setisLoading] = useState(true);

  const [paymentCounts, setPaymentCounts] = useState([]);
  const [paymentsum, setPaymentSum] = useState([]);
  const [policyCounts, setPolicyCounts] = useState([]);
  const [policysum, setPolicySum] = useState([]);
  const [dealerCounts, setDealerCounts] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [
        PaymentCountResponse,
        PaymentSumResponse,
        PolicyCountResponse,
        DealerCountResponse
      ] = await Promise.all([
        Axios.get(config.url + '/statistics/payment/count', { headers: { 'x-token': getToken() } }),
        Axios.get(config.url + '/statistics/payment/sum', { headers: { 'x-token': getToken() } }),
        Axios.get(config.url + '/statistics/policy/count', { headers: { 'x-token': getToken() } }),
        Axios.get(config.url + '/statistics/dealer/count', { headers: { 'x-token': getToken() } }),
      ]);

      // You can directly update the state values without waiting for the whole block to complete.
      setPaymentCounts(PaymentCountResponse.data);
      setPaymentSum(PaymentSumResponse.data);
      setPolicyCounts(PolicyCountResponse.data);
      setDealerCounts(DealerCountResponse.data);

      console.log(policyCounts)

    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setisLoading(false);
    }
};

  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.reload();
        logout();
      } else {
        toast.warn(error.response.data.error || 'An error occurred', {
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const { Title } = Typography;

  const dollor = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z"
        fill="#fff"
      ></path>
      <path
        d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z"
        fill="#fff"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5V5.09199C8.3784 5.20873 7.80348 5.43407 7.32398 5.75374C6.6023 6.23485 6 7.00933 6 8C6 8.99067 6.6023 9.76515 7.32398 10.2463C7.80348 10.5659 8.37841 10.7913 9.00001 10.908L9.00002 12.8492C8.60902 12.7223 8.31917 12.5319 8.15667 12.3446C7.79471 11.9275 7.16313 11.8827 6.74599 12.2447C6.32885 12.6067 6.28411 13.2382 6.64607 13.6554C7.20855 14.3036 8.05956 14.7308 9 14.9076L9 15C8.99999 15.5523 9.44769 16 9.99998 16C10.5523 16 11 15.5523 11 15L11 14.908C11.6216 14.7913 12.1965 14.5659 12.676 14.2463C13.3977 13.7651 14 12.9907 14 12C14 11.0093 13.3977 10.2348 12.676 9.75373C12.1965 9.43407 11.6216 9.20873 11 9.09199L11 7.15075C11.391 7.27771 11.6808 7.4681 11.8434 7.65538C12.2053 8.07252 12.8369 8.11726 13.254 7.7553C13.6712 7.39335 13.7159 6.76176 13.354 6.34462C12.7915 5.69637 11.9405 5.26915 11 5.09236V5Z"
        fill="#fff"
      ></path>
    </svg>,
  ];

  const cart = [
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key={0}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C7.79086 2 6 3.79086 6 6V7H5C4.49046 7 4.06239 7.38314 4.00612 7.88957L3.00612 16.8896C2.97471 17.1723 3.06518 17.455 3.25488 17.6669C3.44458 17.8789 3.71556 18 4 18H16C16.2844 18 16.5554 17.8789 16.7451 17.6669C16.9348 17.455 17.0253 17.1723 16.9939 16.8896L15.9939 7.88957C15.9376 7.38314 15.5096 7 15 7H14V6C14 3.79086 12.2091 2 10 2ZM12 7V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V7H12ZM6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10ZM13 9C12.4477 9 12 9.44772 12 10C12 10.5523 12.4477 11 13 11C13.5523 11 14 10.5523 14 10C14 9.44772 13.5523 9 13 9Z"
        fill="#fff"
      ></path>
    </svg>,
  ];


  const EditorCount = [
    {
      today: "Total Policy Amount",
      title: `Rs. ${paymentsum.totalSum }`,
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "This Month Total",
      title: `${paymentsum.thisMonthPolicies}`,
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "This Year Total",
      title: `${paymentsum.thisYearPolicies}`,
      icon: dollor,
      bnb: "redtext",
    },
    {
      today: "Dealer Count",
      title: `${dealerCounts.count}`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "Total Running Policies",
      title: `${policyCounts.policyCount }`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "This Month Policies",
      title: `${policyCounts.thisMonthPolicies}`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "This Year Policies",
      title: `${policyCounts.thisYearPolicies}`,
      icon: cart,
      bnb: "redtext",
    },
    {
      today: "Today Policies",
      title: `${policyCounts.todayPolicies}`,
      icon: cart,
      bnb: "bnb2",
    },
  ];


  const AdminCount = [
    {
      today: "Total Policy Amount",
      title: `Rs. ${paymentsum.totalSum ? paymentsum.totalSum : 0 }`,
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "Today Total",
      title: `Rs. ${paymentsum.todaySum ? paymentsum.todaySum : 0}`,
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "This Month Total",
      title: `Rs. ${paymentsum.thisMonthSum ? paymentsum.thisMonthSum : 0}`,
      icon: dollor,
      bnb: "bnb2",
    },
    {
      today: "This Year Total",
      title: `Rs. ${paymentsum.thisYearSum ? paymentsum.thisYearSum : 0}`,
      icon: dollor,
      bnb: "redtext",
    },
    {
      today: "Dealer Count",
      title: `${dealerCounts.count ? dealerCounts.count : 0}`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "Total Running Policies",
      title: `${policyCounts.policyCount ? policyCounts.policyCount : 0 }`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "Pending Policies",
      title: `${paymentCounts.pendingCount ? paymentCounts.pendingCount : 0}`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "Confirmed Policies",
      title: `${paymentCounts.confirmedCount ? paymentCounts.confirmedCount : 0}`,
      icon: cart,
      bnb: "redtext",
    },
    {
      today: "Completed Policies",
      title: `${paymentCounts.completedCount ? paymentCounts.completedCount : 0}`,
      icon: cart,
      bnb: "bnb2",
    },
    {
      today: "have to Pay Commision",
      title: `Rs. ${paymentsum.dealerPendingCommition ? paymentsum.dealerPendingCommition : 0}`,
      icon: cart,
      bnb: "redtext",
    },
    {
      today: "Paid Commision",
      title: `Rs. ${paymentsum.dealerCompletedCommition ? paymentsum.dealerCompletedCommition : 0}`,
      icon: cart,
      bnb: "bnb2",
    },
  ];

  return (
    <>
      <div className="layout-content">
        {getUserrole() === 1 ?
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            <h1>Welcome! Ceylinco Collector</h1>
            {EditorCount.map((c, index) => (
              <Col
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox ">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{c.today}</span>
                        <Title level={3}>
                          {c.title} <small className={c.bnb}>{c.persent}</small>
                        </Title>
                      </Col>
                      <Col xs={6}>
                        <div className="icon-box">{c.icon}</div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          :
          <Row className="rowgap-vbox" gutter={[24, 0]}>
            {AdminCount.map((c, index) => (
              <Col
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                className="mb-24"
              >
                <Card bordered={false} className="criclebox ">
                  <div className="number">
                    <Row align="middle" gutter={[24, 0]}>
                      <Col xs={18}>
                        <span>{c.today}</span>
                        <Title level={3}>
                          {c.title} <small className={c.bnb}>{c.persent}</small>
                        </Title>
                      </Col>
                      <Col xs={6}>
                        <div className="icon-box">{c.icon}</div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        }
      </div>
    </>
  );
}

export default Home;
