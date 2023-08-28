import { Layout, Row, Col } from "antd";

function Footer() {
  const { Footer: AntFooter } = Layout;

  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ background: "#fafafa" }}>
      <Row className="just">
        <Col xs={24} md={12} lg={12}>
          <div className="copyright">
          Copyright © {currentYear}. Ceylinco Collector
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
