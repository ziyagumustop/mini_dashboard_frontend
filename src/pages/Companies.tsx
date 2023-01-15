import { Button, Col, Input, message, Modal, Popconfirm, Row } from 'antd';
import React from 'react'
import AntdTable, { ColumnInterface } from '../components/AntdTable';
import { apiService } from '../services/api.service';

export interface CompanyType {
  company_legal_number: string;
  company_name: string;
  created_at: string;
  deleted_at: string | null;
  incorporation_country: string;
  website: string;
  _id: string;
}

export default function Companies() {
  /* Modal States*/
  const [open, setOpen] = React.useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = React.useState<boolean>(false)
  const [id, setId] = React.useState<string | null>()
  const [companyName, setCompanyName] = React.useState('')
  const [companyLegalNumber, setCompanyLegalNumber] = React.useState('')
  const [incorporationCountry, setIncorporationCountry] = React.useState('')
  const [website, setWebsite] = React.useState('')
  const [createOrUpdate, setCreateOrUpdate] = React.useState<string>('')
  /*Table States */
  const [refresh, setRefresh] = React.useState<boolean>(false)

  const columns: ColumnInterface[] = [
    {
      title: 'Company Name',
      dataIndex: 'company_name',
      sorter: true,

      searchableType: "string"
    },
    {
      title: 'Company Legal Number',
      dataIndex: 'company_legal_number',
      sorter: true,

      searchableType: "number",
    },
    {
      title: 'Incorporation Country',
      dataIndex: 'incorporation_country',
      searchableType: "string",
      sorter: true,
    },
    {
      title: 'Website',
      dataIndex: 'website',
    },
    {
      title: 'Action',
      render: (e) => <Row gutter={[8, 8]}>
        <Col>
          <Button
            type="primary"
            onClick={() => {
              setCreateOrUpdate('update')
              setId(e._id)
              setCompanyName(e.company_name)
              setCompanyLegalNumber(e.company_legal_number)
              setIncorporationCountry(e.incorporation_country)
              setWebsite(e.website)
              setOpen(true);
            }}>
            Düzenle
          </Button>
        </Col>
        <Col>
          <Popconfirm
            placement="topLeft"
            title={'Are you sure to delete this company ?'}
            description={'Delete the company'}
            onConfirm={() => { deleteCompany(e._id) }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger={true}>Delete</Button>
          </Popconfirm>
        </Col>
      </Row>
    }
  ];

  const deleteCompany = async (id: string) => {
    try {
      await apiService.post('/company/delete', { id: id })
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
      await apiService.post('/company/' + type, {
        id: id,
        company_name: companyName,
        company_legal_number: companyLegalNumber,
        incorporation_country: incorporationCountry,
        website: website,
      })
      message.success('Successfull ' + type)
      setConfirmLoading(false);
      setRefresh(!refresh)
      handleClose()
    } catch (error: any) {
      console.log(error)
      message.error(error.response.data.message, 5)
      setConfirmLoading(false);
    }
  }

  const handleClose = () => {
    setOpen(false)
    setId(null)
    setCompanyName('')
    setCompanyLegalNumber('')
    setIncorporationCountry('')
    setWebsite('')
  }

  return (
    <div>
      <Row justify={'end'} style={{ padding: '1rem 0.5rem' }}>
        <Col>
          <Button type="primary" onClick={() => { setCreateOrUpdate('create'); setOpen(true) }}>
            Add Company
          </Button>
        </Col>
      </Row>
      <AntdTable columns={columns} refresh={refresh} setRefresh={setRefresh} pathName='/company' />
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
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Company Legal Number
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={companyLegalNumber}
                  onChange={(e) => setCompanyLegalNumber(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Incorporation Country
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={incorporationCountry}
                  onChange={(e) => setIncorporationCountry(e.target.value)} />
              </Col>
            </Row>
            <Row justify={'space-between'} style={{ padding: '0.4rem 0' }} align={'middle'}>
              <Col>
                Website
              </Col>
              <Col>
                <Input
                  type={'string'}
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)} />
              </Col>
            </Row>
          </Col>
        </Row>

      </Modal >
    </div >
  )
}
