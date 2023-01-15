import { Button, Col, Input, message, Modal, Row, Select } from 'antd';
import React from 'react'
import AntdTable, { ColumnInterface } from '../components/AntdTable';
import { DebounceSelect } from '../components/DebounceSelect';
import { apiService } from '../services/api.service';

export interface ProductType {
  amount_unit: string;
  company: string;
  created_at: string;
  deleted_at: string | null;
  incorporation_amount: string;
  product_category: string;
  product_name: string;
  _id: string;
}




export default function Products() {
  /* Modal States*/
  const [open, setOpen] = React.useState<boolean>(false)
  const [createOrUpdate, setCreateOrUpdate] = React.useState<string>('')
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false)
  const [id, setId] = React.useState<string | null>()
  const [productName, setProductName] = React.useState('')
  const [productCategory, setProductCategory] = React.useState('')
  const [incorporationAmount, setIncorporationAmount] = React.useState('')
  const [amountUnit, setAmountUnit] = React.useState('')
  const [company, setCompany] = React.useState<{ label: string, value: string }>()
  /*Table States */
  const [refresh, setRefresh] = React.useState<boolean>(false)

  const columns: ColumnInterface[] = [
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      sorter: true,
      searchableType: "string"
    },
    {
      title: 'Product Category',
      dataIndex: 'product_category',
      sorter: true,
      searchableType: "number",
    },
    {
      title: 'Incorporation Amount',
      dataIndex: 'incorporation_amount',
      searchableType: "string",
      sorter: true,
    },
    {
      title: 'Amount Unit',
      dataIndex: 'amount_unit',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      render: (e) => <>{e.company_name}</>
    },
    {
      title: 'Action',
      render: (e) => <Row gutter={[8, 0]}>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setCreateOrUpdate('update')
              setId(e._id)
              setProductName(e.product_name)
              setProductCategory(e.product_category)
              setIncorporationAmount(e.incorporation_amount)
              setAmountUnit(e.amount_unit)
              setCompany({ value: e.company._id, label: e.company.company_name })
              setOpen(true);
            }}>
            Düzenle
          </Button>
        </Col>
        <Col>
          <Button onClick={() => { deleteProduct(e._id) }} danger={true}>Delete</Button>
        </Col>
      </Row>
    }
  ];

  const deleteProduct = async (id: string) => {
    try {
      await apiService.post('/product/delete', { id: id })
      message.success('Başarıyla Silindi')
      setRefresh(!refresh)
    }
    catch (error: any) {
      message.error(error.response.data._message)
    }
  }


  const handleOk = async (type: string) => {
    setConfirmLoading(true);
    try {
      let result = await apiService.post('/product/' + type, {
        id: id,
        product_name: productName,
        product_category: productCategory,
        incorporation_amount: incorporationAmount,
        amount_unit: amountUnit,
        company: company?.value
      })
      setConfirmLoading(false);
      setRefresh(!refresh)
      setOpen(false)
    } catch (error: any) {
      message.error(error.response.data.message, 5)
      setConfirmLoading(false);

    }
  }

  const handleClose = () => {
    setOpen(false)
    setId(null)
    setProductName('')
    setProductCategory('')
    setIncorporationAmount('')
    setAmountUnit('')
    setCompany(undefined)
  }

  return (
    <>
      <Row justify={'end'} style={{ padding: '1rem 0.5rem' }}>
        <Col>
          <Button type="primary" onClick={() => { setCreateOrUpdate('create'); setOpen(true) }}>
            Add Product
          </Button>
        </Col>
      </Row>
      <AntdTable columns={columns} refresh={refresh} setRefresh={setRefresh} pathName={'/product'}></AntdTable>
      <Modal
        open={open}
        onOk={() => handleOk(createOrUpdate)}
        onCancel={handleClose}
        confirmLoading={confirmLoading}
      >
        <Row style={{ padding: '1rem' }}>
          <Col span={24}>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Company Name
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Company Legal Number
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Incorporation Country
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={incorporationAmount}
                  onChange={(e) => setIncorporationAmount(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Amount Unit
              </Col>
              <Col span={10}>
                <Select
                  value={amountUnit}
                  onChange={(e) => setAmountUnit(e)}
                  options={[
                    {
                      value: 'kg',
                      label: 'kg',
                    },
                    {
                      value: 'pcs',
                      label: 'pcs',
                    },

                  ]}
                  style={{width:'100%'}}>
                </Select>
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Website
              </Col>
              <Col span={10}>
                <DebounceSelect value={company} setValue={setCompany} route="/company" />
              </Col>
            </Row>
          </Col>
        </Row>

      </Modal >
    </>
  )
}
