/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Pagination,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../../library/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import config from "../../constants/config";
import type { PaginationProps } from "antd";

const purchasesStringStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5,
} as const;

type purchasesStatus = -1 | 1 | 2 | 3 | 4 | 5;

type imagesType = {
  _id?: string;
  url: string;
};

interface IOrder {
  _id?: string;
  productId: number;
  name: string;
  price: number;
  price_before_discount: number;
  buy_count: number;
  images: imagesType[];
  createdAt?: string;
  updatedAt?: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    address: string;
  };
  status?: purchasesStatus;
}

const Order = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = params.get("page");
  const limit = params.get("limit");
  const int_page = page ? parseInt(page) : 1;
  const int_limit = limit ? parseInt(limit) : 5;
  const onChangePagination: PaginationProps["onChange"] = (pageNumber) => {
    console.log("Page: ", pageNumber);
    navigate(`/purchases?page=${pageNumber}`);
  };

  const getpurchases = async (page = 1, limit = 5) => {
    return axiosClient.get(
      config.urlAPI + `/v1/purchases?page=${page}&limit=${limit}`
    );
  };

  const queryClient = useQueryClient();

  const queryOrder = useQuery({
    queryKey: ["purchases", int_page],
    queryFn: () => getpurchases(int_page, int_limit),
  });

  const fetchDelete = async (objectID: string) => {
    return axiosClient.delete(config.urlAPI + "/v1/purchases/" + objectID);
  };

  const mutationDelete = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Delete success !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: () => {
      // Handle error when API call fails
    },
  });

  const fetchUpdate = async (formData: IOrder) => {
    const { _id, ...payload } = formData;
    return axiosClient.patch(config.urlAPI + "/v1/purchases/" + _id, payload);
  };

  const mutationUpdate = useMutation({
    mutationFn: fetchUpdate,
    onSuccess: () => {
      console.log("Update success !");
      messageApi.open({
        type: "success",
        content: "Update success !",
      });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setIsModalEditOpen(false);
    },
    onError: () => {
      // Handle error when API call fails
    },
  });

  const [updateForm] = Form.useForm();
  const handleEditOk = () => {
    updateForm.submit();
  };

  const handleEditCancel = () => {
    setIsModalEditOpen(false);
  };

  const onFinishEdit = async (values: any) => {
    mutationUpdate.mutate(values);
  };

  const onFinishEditFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  function getFormItemOptions() {
    const options = [];
    for (const [key, value] of Object.entries(purchasesStringStatus)) {

      options.push({
        value, // Use value directly as it's already retrieved from the object
        label: key.replace(/([A-Z])/g, " $1").toUpperCase(), // Use key for label
      });
    }
    return options;
  }
  

  const columns: ColumnsType<IOrder> = [
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Shipped Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        // Here's where the magic happens
        switch (text) {
          case purchasesStringStatus.inCart:
            return "In Cart";
          case purchasesStringStatus.all:
            return "All";
          case purchasesStringStatus.waitForConfirmation:
            return "Waiting for Confirmation";
          case purchasesStringStatus.waitForGetting:
            return "WaitForGetting";
          case purchasesStringStatus.inProgress:
            return "InProgress";
          case purchasesStringStatus.delivered:
            return "Delivered";
          case purchasesStringStatus.cancelled:
            return "Cancelled";
          // ... add cases for other statuses
          default:
            return text;
        }
      },
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "user",
      render: (_text, record) => {
        return record.user.firstName + record.user.lastName;
      },
    },
    {
      title: "Đia chỉ",
      dataIndex: "user",
      key: "shippingAddress",
      render: (_text, record) => {
        return record.user.address;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setIsModalEditOpen(true);
              updateForm.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              mutationDelete.mutate(record._id as string);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Table
        pagination={false}
        columns={columns}
        dataSource={queryOrder.data?.data.data}
      />
      <div>
        <Pagination
          defaultCurrent={int_page}
          total={queryOrder.data?.data.data.totalRecords}
          showSizeChanger
          defaultPageSize={int_limit}
          onChange={onChangePagination}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>

      {/* Modal for Edit a new order */}
      <Modal
        title="Edit Order"
        open={isModalEditOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form
          form={updateForm}
          name="edit-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinishEdit}
          onFinishFailed={onFinishEditFailed}
          autoComplete="off"
        >
          <Form.Item<IOrder>
            label="Status"
            name="status"
            rules={[{ required: true, message: "" }]}
          >
            <Select options={getFormItemOptions()} />
          </Form.Item>

          <Form.Item hidden label="Id" name="_id">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Order;
