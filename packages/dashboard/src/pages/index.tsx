import React, { FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Form, Input, Layout, Button, Row, Col, Card, Typography } from 'antd';
import { GithubOutlined, EditOutlined } from '@ant-design/icons';
import samples from '../samples.json';

import style from './index.module.css';

function editPath(uri: string) {
  const url = new URL(uri);

  return `/projects/edit/${url.search}`;
}

const HomeRoute: FunctionComponent = () => {
  const router = useRouter();

  const goToEdit = (uri: string) => {
    try {
      router.push(editPath(uri))
    } catch(e) {
      console.log(e);
    }
  }

  const handleNew = () => {
    router.push(`/projects/edit/?w=800&h=400`);
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
          <Col lg={12}>
            <Card>
              <Button onClick={handleNew}>Start new project</Button>

              <Form size="large">
                <Form.Item name="url">
                  <Input.Search
                    placeholder="Edit"
                    enterButton={<EditOutlined />}
                    onSearch={(val) => goToEdit(val)}
                  />
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
                  <Link href={editPath(sample.url)}><EditOutlined /></Link>
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

export default HomeRoute;
