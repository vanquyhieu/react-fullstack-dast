/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Image,
  // Button,
  // Modal,
  // Form,
  // Input,
  message,
  Card,
  Popconfirm,
  Spin,
  // Pagination,
} from "antd";
// import type { ColumnsType } from "antd/es/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosClient } from "../../library/axiosClient";
import config from "../../constants/config";
import React, { useState } from "react";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import UploadImages from "../../components/ImageUpload";
import form from "antd/es/form";
import axios from "axios";


type responseType = {
  destination: string;
  fieldname: string;
  filename: string;
  path: string;
  size: number;
};

type itemType = {
  response: responseType;
};

type categoryType = {
  _id?: string;
  name: string;
};
type supplierType = {
  _id?: string;
  name: string;
};
type imagesType = {
  _id?: string;
  url: string;
};

interface DataType {
  _id: string;
  id: number;
  name: string;
  description:string;
  price: number;
  price_before_discount:number;
  quantity: number;
  sold?:number;
  category: categoryType;
  supplier: supplierType;
  images: imagesType[];
}

const ProductPage = () => {
  const navigate = useNavigate();
  //message edit
  const [messageApi, contextHolder] = message.useMessage();
  //Toggle Modal Edit
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  //Toggle Modal Create
  const [isModalCreateOpen, setIsModalCreateOpen] = React.useState(false);
  //upload
  const [fileList, setFileList] = React.useState<itemType[]>([]);

  console.log("fileList", fileList);

  let filePathFormat: (string | undefined)[] = [];
  if (fileList.length > 0) {
    filePathFormat = fileList.map((item) => {
      if (item.response) {
        // Check if response exists
        return `http://localhost:3000/images/${item.response?.filename}`;
      }
    });
  }
  console.log("filePathFormat", filePathFormat);
  // create product
  const onFinish = async (values: DataType) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo: AnyObject) => {
    console.log("Failed:", errorInfo);
  };

  //======= lấy sản phẩm  =====//
  // Access the client
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () =>
      await axiosClient.get(`http://localhost:3000/api/v1/products/product-list`),
  });
  // console.log("queryProducts", data);

  //======= lấy danh mục  =====//
  const queryCategories = useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      await axiosClient.get(`http://localhost:3000/api/v1/categories`),
  });
  // const currentCategory = queryCategories?.data?.data.data.categories.find(
  //   (item) => item._id === currentCategoryId
  // );
  //======= lấy suppliers  =====//
  const querySuppliers = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () =>
      await axiosClient.get(`http://localhost:3000/api/v1/suppliers`),
  });
  // console.log("querySuppliers", querySuppliers);

  //======= Sự kiện XÓA =====//
  const fetchDelete = async (_id: string) => {
    return await axiosClient.delete(config.urlAPI + "/v1/products/" + _id);
  };
  const mutationDelete = useMutation({
    mutationFn: fetchDelete,
    onSuccess: () => {
      console.log("Delete success !");
      messageApi.open({
        type: "success",
        content: "Delete success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      //khi gọi API bị lỗi
      console.log("mutationDelete error Api");
    },
  });
  //======= Sự kiện EDit =====//
  const fetchUpdate = async (formData: DataType) => {
    const { _id, ...payload } = formData;
    return axiosClient.patch(config.urlAPI + "/products/" + _id, payload);
  };
  const mutationUpdate = useMutation({
    mutationFn: fetchUpdate,
    onSuccess: () => {
      console.log("Update success !");
      messageApi.open({
        type: "success",
        content: "Update success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ["products"] });
      //Ẩn modal
      setIsModalEditOpen(false);
    },
    onError: () => {
      //khi gọi API bị lỗi
      console.log("mutationUpdate error Api");
    },
  });
  const [updateForm] = Form.useForm();
  //Khi nhấn nut OK trên Modal
  const handleEditOk = () => {
    // setIsModalEditOpen(false);
    console.log("edit submit");
    //Cho submit form trong Modal
    updateForm.submit();
  };
  //Khi nhấn nut Cancel trên modal
  const handleEditCancel = () => {
    setIsModalEditOpen(false);
    console.log("edit cancel");
  };
  //hàm lấy thông tin từ form Edit
  const onFinishEdit = async (values: DataType) => {
    console.log("Success:", values); //=> chính là thông tin ở form edit
    //Gọi API để update category
    mutationUpdate.mutate(values);
  };
  //hàm lấy lỗi từ form Edit
  const onFinishEditFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };
  //======= Sự kiện Create =====//
  const fetchCreate = async (formData: DataType) => {
    return await axiosClient.post(config.urlAPI + "/v1/products", formData);
  };
  const mutationCreate = useMutation({
    mutationFn: fetchCreate,
    onSuccess: () => {
      console.log("Create success !");
      messageApi.open({
        type: "success",
        content: "Create success !",
      });
      // Làm tươi lại danh sách danh mục dựa trên key đã định nghĩa
      queryClient.invalidateQueries({ queryKey: ["products"] });
      //Ẩn modal
      setIsModalCreateOpen(false);
      createForm.resetFields(); //làm trống các input
    },
    onError: () => {
      //khi gọi API bị lỗi
    },
  });
  // create form
  const [createForm] = Form.useForm();
  //Khi nhấn nut OK trên Modal
  const handleCreateOk = () => {
    // setIsModalCreateOpen(false);
    console.log("Create submit");
    //Cho submit form trong Modal
    createForm.submit();
  };
  //Khi nhấn nut Cancel trên modal
  const handleCreateCancel = () => {
    setIsModalCreateOpen(false);
    console.log("Create cancel");
  };

  //hàm lấy thông tin từ form Create
  const onFinishCreate = async (values: DataType) => {
    console.log("Success:", values); //=> chính là thông tin ở form edit
    values.id = newId; // Gán ID mới cho đối tượng values

    // 1. Extract URLs from filePathFormat
    const imageUpload = filePathFormat.filter(Boolean) as string[]; // Remove any undefined values
    const imageUploadUrls = imageUpload.map((url) => ({ url }));

    // 2. Build the images array with URLs
    values.images = [...values.images, ...imageUploadUrls];
    //Gọi API để update product
    await mutationCreate.mutate(values);
    createForm.resetFields();
  };
  const onFinishCreateFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };
  //======= Destructuring =====//
  let productData = [];
  if (data && data.data) {
    const {
      data: {
        data: { products },
      },
    } = data;
    // const [products] = productsData
    console.log("productsItem", products);
    productData = products;
  }
  // console.log("productData", productData);

  //======= begin logic id max =====//
  let max: string | null = null; // Khai báo biến max trước khi vào hàm if
  if (productData) {
    console.log("productDataId", data);
    const idItem = productData.map((item: DataType) => item.id);
    console.log("idItem", idItem);
    max = idItem[0];

    for (const id of idItem) {
      if (Number(id) > Number(max)) {
        max = id;
      }
      console.log("max", max);
    }
  }
  // Nếu max chưa được gán giá trị (nghĩa là chưa có categoriesData), hãy bắt đầu với ID là 1
  const newId = max ? Number(max) + 1 : 1;
  //end logic id max

  // ERR fetchdata
  if (isError) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("errorMessage", errorMessage);
    // return <div>Error: {error.message}</div>;
  }

  // Column Page product
  const columns: ColumnsType<DataType> = [
    //id
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    //name
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    // ảnh
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      render: (_, record) => (
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          {record.images.map((item, index) => (
            <Image key={index} src={item.url} width={50}></Image>
          ))}
        </Image.PreviewGroup>
      ),
    },
    //des
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    //price
    { title: "Giá", dataIndex: "price", key: "price" },
    //stock
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    //discount
    {
      title: "Giá gốc",
      dataIndex: "price_before_discount",
      key: "price_before_discount",
    },
    //category
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (_text, record) => {
        return record.category?.name;
      },
    },
    //supp
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (_text, record) => {
        return record.supplier?.name;
      },
    },
    //action
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => {
              console.log("Edit this item");
              setIsModalEditOpen(true); //show modal edit lên
              updateForm.setFieldsValue({...record,
                 supplierId: record.supplier._id,
                  categoryId: record.category._id
                });            
              }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              // DELETE
              console.log("DELETE", record);
              mutationDelete.mutate(record._id);
            }}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onCancel={() => {}}
            okText="Đồng ý"
            okType="danger"
            cancelText="Đóng"
          >
            <Button danger type="dashed" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <>
      <div>
        <Card
          title="Product List"
          extra={
            <Button
              className="visible"
              type="primary"
              onClick={() => {
                console.log("Open Model Create products");
                setIsModalCreateOpen(true);
              }}
            >
              Thêm mới
            </Button>
          }
        >
          {contextHolder}
          {/* ==============TABLET================= */}
          {isLoading ? (
            <Spin tip="Loading">
              <div className="content" />
            </Spin>
          ) : (
            <Table columns={columns} dataSource={productData} rowKey={"_id"} />
          )}
          {/* create product */}
          <Modal
            title="Create Product"
            open={isModalCreateOpen}
            onOk={handleCreateOk}
            onCancel={handleCreateCancel}
          >
            <Form
              form={createForm}
              name="create-product-form"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinishCreate}
              onFinishFailed={onFinishCreateFailed}
              autoComplete="off"
              initialValues={{ images: [] }}
            >
              {/* ID */}
              <Form.Item<DataType> label="ID" name="id">
                <Input placeholder={`${newId}`} readOnly />
              </Form.Item>
              {/* Tên sản phẩm */}
              <Form.Item<DataType>
                label="Tên sản phẩm"
                name="name"
                rules={[
                  { required: true, message: "Please input Category Name!" },
                ]}
              >
                <Input />
              </Form.Item>
              {/* Giá */}
              <Form.Item<DataType>
                label="Giá hiện tại"
                name="price"
                rules={[
                  { required: true, message: "Please input Category Name!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              {/*Giảm giá %*/}
              <Form.Item<DataType>
                label="Giá gốc"
                name="price_before_discount"
                rules={[
                  { required: true, message: "Please input Category Name!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              {/* Số lượng hiện có */}
              <Form.Item<DataType>
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Please input Category Name!" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              {/* Mô tả chi tiết */}
              <Form.Item<DataType>
                label="Mô tả chi tiết"
                name="description"
                rules={[{ required: false }]}
              >
                <Input />
              </Form.Item>
              {/* Tên danh mục */}
              <Form.Item<DataType>
                label="Tên danh mục"
                name="category"
                rules={[
                  { required: true, message: "Please input stock Name!" },
                ]}
              >
                <Select>
                  {queryCategories?.data?.data.data.categories.map(
                    (item: categoryType) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
              {/* Tên nhà cung cấp */}
              <Form.Item<DataType>
                label="Tên nhà cung cấp "
                name="supplier"
                rules={[
                  { required: true, message: "Please input stock Name!" },
                ]}
              >
                <Select>
                  {querySuppliers?.data?.data.data.supplier.map(
                    (item: supplierType) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>
              {/* Ảnh chọn từ pc */}
              <Form.Item
                label="Ảnh"
                rules={[{ required: false, message: "Chọn ảnh" }]}
              >
                <UploadImages
                  fileList={fileList}
                  setFileList={setFileList}
                ></UploadImages>
              </Form.Item>
              {/* images */}
              <Form.List name="images">
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map((field, index) => (
                      <Space
                        key={field.key} // Use key for efficient renderings
                      >
                        <Form.Item
                          label={`image ${index + 1}`}
                          name={[index, "url"]}
                          extra="Ex: https://loremflickr.com/100/100/business"
                        >
                          <Input name="url" />
                        </Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      disabled={fields.length >= 4}
                    >
                      Add Image URL
                    </Button>
                  </div>
                )}
              </Form.List>
            </Form>
          </Modal>
          {/* End Create Modal */}
          {/* begin Edit Modal */}
          <Modal
            title="Edit Product"
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
              <Form.Item<DataType>
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input category Name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<DataType>
                label="Price"
                name="price"
                rules={[
                  { required: true, message: "Please input Price Name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item<DataType>
                label="Số lượng"
                name="quantity"
                rules={[
                  { required: true, message: "Please input stock Name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<DataType>
                label="metaDescription"
                name="description"
                rules={[{ max: 500, message: "Tối đa 500 kí tự" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tên danh mục"
                name="categoryId"
                rules={[
                  { required: true, message: "Please input stock Name!" },
                ]}
              >
                <Select>
                  {queryCategories?.data?.data.data.categories.map(
                    (item: categoryType) => (
                      <Select.Option key={item._id} value={item._id} name={item.name}>
                        {item.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                label="Tên nhà cung cấp "
                name="supplierId"
                rules={[
                  { required: true, message: "Please input stock Name!" },
                ]}
              >
                <Select>
                  {querySuppliers?.data?.data.data.supplier.map(
                    (item: supplierType) => (
                      <Select.Option key={item._id} value={item._id} name={item.name}>
                        {item.name}
                      </Select.Option>
                    )
                  )}
                </Select>
              </Form.Item>

              <Form.List name="images">
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map((field, index) => (
                      <Space
                        key={field.key} // Use key for efficient renderings
                      >
                        <Form.Item
                          label={`image ${index + 1}`}
                          name={[index, "url"]}
                          extra="Ex: https://loremflickr.com/100/100/business"
                        >
                          <Input name="url" />
                        </Form.Item>
                        <CloseOutlined
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </Space>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      disabled={fields.length >= 4}
                    >
                      Add Image URL
                    </Button>
                  </div>
                )}
              </Form.List>

              <Form.Item hidden label="Id" name="_id">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
          {/* End Edit Modal */}
        </Card>
      </div>
    </>
  );
};

export default ProductPage;
