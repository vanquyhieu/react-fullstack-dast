import { Button, Form, Input, Space, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CloseOutlined } from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

interface ICategory {
  _id: string;
  id: string;
  name: string;
  image?: string;
}
const CategoryEdit = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const [messageApi, contextHolder] = message.useMessage();

  const msgSuccess = () => {
    messageApi.open({
      type: "success",
      content: "Cập nhật danh mục thành công",
    });
  };

  const msgError = () => {
    messageApi.open({
      type: "error",
      content: "This is an error message",
    });
  };

  const queryClient = useQueryClient();

  const fetchData = () =>
    fetch(`http://localhost:3000/api/v1/categories/${params.id}`, {
      method: "GET",
    })
    .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
    .catch((error) => {
        console.error(error);
      });

  // Sử dụng useQuery để fetch data từ API
  useQuery<ICategory, Error>({
    queryKey: ["categories", params?.id as string | undefined],
    queryFn: fetchData,
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
  });

  //hàm call API update sản phẩm
  const updateData = (payload: ICategory) =>
    fetch(`http://localhost:3000/api/v1/categories/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

  // Mutations
  const updateMutation = useMutation({
    mutationFn: updateData,
    onSuccess: () => {
      msgSuccess();
      // Sau khi thêm mới thành công thì update lại danh sách danh mucj dựa vào queryKey
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onError: (err) => {
      msgError();
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = (values: ICategory) => {
    form.validateFields().then((values) => {
      updateMutation.mutate(values);
    });
  };

  return (
    <Card
      title="Edit a category"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate("/categories");
          }}
        >
          Danh sách
        </Button>
      }
    >
      {contextHolder}
      <Form
        {...layout}
        form={form}
        name="category-edit-form"
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Ex: Mobile" />
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

        <Form.Item {...tailLayout}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateMutation.isLoading}
            >
              Submit
            </Button>
          </Space>
        </Form.Item>
        </Form>
    </Card>
  );
};

export default CategoryEdit;