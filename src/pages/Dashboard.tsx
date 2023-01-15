import { Button, Card, Col, List, message, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api.service";
import { CompanyType } from "./Companies";
import { ProductType } from "./Products";

interface StatisticDataType {
  data: {
    countCompany: number;
    lastCompanies: [CompanyType];
    countProduct: number;
    lastProducts: [ProductType];
  };
}

const { Title } = Typography;

export default function Dashboard() {
  const [countCompany, setCountCompany] = React.useState(0);
  const [countProduct, setCountProduct] = React.useState(0);
  const [lastCompanies, setLastCompanies] = React.useState<CompanyType[]>([]);
  const [lastProducts, setLastProducts] = React.useState<ProductType[]>([]);

  const loaderFunction = async () => {
    let result: StatisticDataType;
    try {
      result = await apiService.post("/getStatistics");
      let data = result.data;
      setCountCompany(data.countCompany);
      setLastCompanies(data.lastCompanies);
      setCountProduct(data.countProduct);
      setLastProducts(data.lastProducts);
    } catch (error) {
      message.error("İstatistiklerde hata oluştu");
    }
  };

  useEffect(() => {
    loaderFunction();
  }, []);

  return (
    <>
      <Row
        gutter={[16, 16]}
        justify={"space-around"}
        style={{ margin: "1rem", marginBottom: "1rem", marginTop: "1rem" }}
      >
        <Col sm={24} md={12} xl={6} span={24}>
          <Card bordered={false}>
            <div>
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>Toplam Firma Sayısı</span>
                  <Title level={3}>{countCompany}</Title>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col sm={24} md={12} xl={6} span={24}>
          <Card bordered={false} className="criclebox ">
            <div>
              <Row align="middle" gutter={[24, 0]}>
                <Col xs={18}>
                  <span>Toplam Ürün Sayısı</span>
                  <Title level={3}>{countProduct}</Title>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <Row
        gutter={[16, 16]}
        justify={"space-around"}
        style={{ margin: "1rem", marginBottom: "1rem", marginTop: "1rem" }}
      >
        <Col sm={24} md={12} xl={6} span={24}>
          <Card
            bordered={false}
            className="header-solid h-full ant-invoice-card"
            title={<h6 className="font-semibold m-0">Son 3 Firma</h6>}
            extra={
              <Link to="/companies">
                <Button type="primary">
                  <span>VIEW ALL</span>
                </Button>
              </Link>
            }
          >
            <List
              itemLayout="horizontal"
              className="invoice-list"
              dataSource={lastCompanies}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={item.company_name}
                    description={item.website}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col sm={24} md={12} xl={6} span={24}>
          <Card
            bordered={false}
            className="header-solid h-full ant-invoice-card"
            title={<h6 className="font-semibold m-0">Son 3 Ürün</h6>}
            extra={
              <Link to="/products">
                <Button type="primary">
                  <span>VIEW ALL</span>
                </Button>
              </Link>
            }
          >
            <List
              itemLayout="horizontal"
              className="invoice-list"
              dataSource={lastProducts}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    title={item.product_name}
                    description={item.product_category}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
