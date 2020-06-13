import React, { FunctionComponent } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Form, Input, Layout, Button } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { TopBar } from '../components/TopBar';

interface HomeFormStore extends Store {
  url: string
}

export const HomeRoute: FunctionComponent<RouteComponentProps> = () => {
  const [form] = Form.useForm();
  const handleEdit = (values: Store) => {
    const urlString = values['url'] as string
    try {
      const url = new URL(urlString);

      navigate(`/projects/edit${url.search}`)
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <Layout>
      <TopBar />
      <Layout.Content>
        <Form form={form} size="large" onFinish={handleEdit}>
          <Form.Item name="url">
            <Input placeholder="Edit" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
}
