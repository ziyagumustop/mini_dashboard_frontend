import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, Col, Input, message, Pagination, Row, Table } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import qs from "qs";
import { apiService } from "../services/api.service";

export interface ColumnInterface {
  title: string;
  dataIndex?: string;
  sorter?: boolean;
  searchableType?: string;
  render?: (element: any) => ReactNode;
}

interface DataType {
  _id: "string";
}

interface TableParams {
  pagination: TablePaginationConfig;
  sortField?: string | undefined;
  sortOrder?: string | undefined;
  filters?: Record<string, FilterValue | null>;
  order?: string | null | undefined;
  field?: React.Key | readonly React.Key[];
  column?: Object | undefined;
  columnKey?: React.Key | undefined;
}

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

export default function AntdTable(props: {
  columns: ColumnInterface[];
  refresh?: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  pathName: string;
}) {
  const { columns, refresh, setRefresh, pathName } = props;
  const [filterValue, setFilterValue] = useState<string>("");

  let a: { columns: any[]; searchValue: string } = {
    columns: [],
    searchValue: filterValue.trim(),
  };
  columns.forEach((e, i) => {
    a["columns"][i] = [];
    a["columns"][i].data = e.dataIndex;
    a["columns"][i].searchable = e.searchableType;
  });

  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  function detectFilterType(filter: string) {
    if (isNaN(+filter)) {
      return "string";
    }
    if (isNaN(parseFloat(filter))) {
      return "string";
    }
    return "number";
  }

  const fetchData = () => {
    let fetchParams = tableParams;
    if (filterValue) {
      let searchType = detectFilterType(filterValue);
      a.columns.forEach((e) => {
        e.searchable = e.searchable == searchType;
        delete e.searchableType;
      });
    }
    delete tableParams.column;
    setLoading(true);
    apiService
      .post(
        pathName + `/list`,
        {
          ...qs.parse(qs.stringify(a)),
          ...qs.parse(qs.stringify(getRandomuserParams(tableParams))),
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => res.data)
      .then(({ results, info }) => {
        setData(results);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            ...fetchParams.pagination,
            total: info.results,
          },
        });
      });
  };
  useEffect(() => {
    fetchData();
  }, [
    refresh,
    JSON.stringify(tableParams.pagination?.current),
    JSON.stringify(tableParams.pagination?.pageSize),
    JSON.stringify(tableParams?.order),
    JSON.stringify(tableParams?.field),
  ]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    setTableParams({
      ...tableParams,
      ...sorter,
      pagination,
      filters,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const searchTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
    if (tableParams.pagination.current != 1) {
      setTableParams({
        ...tableParams,
        pagination: { ...tableParams.pagination, current: 1 },
      });
    } else {
      setRefresh(!refresh);
    }
  };

  return (
    <>
      <Row justify={"space-between"} align={"middle"}>
        <Col style={{ padding: "0 0.5rem " }}>
          <Button type="primary" onClick={fetchData}>
            Refresh
          </Button>
        </Col>
        <Col md={8} sm={12} xs={24}>
          <Row align={"middle"} gutter={5} style={{ margin: "0.5rem" }}>
            <Col>Search:</Col>
            <Col flex={"auto"}>
              <Input type="text" value={filterValue} onChange={searchTable} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
      />
    </>
  );
}
