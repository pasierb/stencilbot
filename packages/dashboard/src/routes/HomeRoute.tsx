import React, { FunctionComponent } from 'react';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { Form, Input, Layout, Button, Row, Col, Card, Typography } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { GithubOutlined, EditOutlined } from '@ant-design/icons';
import samples from '../samples.json';

import style from './HomeRoute.module.css';

interface HomeFormStore extends Store {
  url: string
}

function editPath(uri: string) {
  const url = new URL(uri);

  return `/projects/edit${url.search}`;
}

export const HomeRoute: FunctionComponent<RouteComponentProps> = () => {
  const [form] = Form.useForm();

  const goToEdit = (uri: string) => {
    try {
      navigate(editPath(uri));
    } catch(e) {
      console.log(e);
    }
  }

  const handleEdit = (values: Store) => {
    const urlString = values['url'] as string

    goToEdit(urlString);
  }

  const handleNew = () => {
    navigate(`/projects/edit?w=800&h=400`);
  }

  return (
    <Layout className={style.HomeRoute}>
      <Layout.Content>
        <Row justify="center">
          <Col>
            <Typography.Title>Stencilbot</Typography.Title>
          </Col>
        </Row>

        <Row justify="center" gutter={10}>
          <Col lg={6}>
            <Card>
              <Button onClick={handleNew}>Create new</Button>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <Form form={form} size="large" onFinish={handleEdit}>
                <Form.Item name="url">
                  <Input placeholder="Edit" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">Submit</Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        <Row justify="center" gutter={20}>
          {samples.map((sample, i) => (
            <Col lg={3} sm={5} xs={12} key={i}>
              <Card
                onClick={() => goToEdit(sample.url)}
                hoverable
                cover={<img src={sample.url} alt={sample.title} />}
                actions={[
                  <Link to={editPath(sample.url)}><EditOutlined /></Link>
                ]}
              >
                <Card.Meta
                  title={sample.title}
                  description={sample.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Layout.Content>
      <Layout.Footer>
        <ul className={style.footerLinks}>
          <li>
            <a href="https://github.com/pasierb/stencilbot">
              <GithubOutlined /> View the code
            </a>
          </li>
          <li>
            <a href="https://github.com/pasierb/stencilbot/issues">
              Report a bug
            </a>
          </li>
        </ul>
      </Layout.Footer>
    </Layout>
  );
}
