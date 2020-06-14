import React, { FunctionComponent } from 'react';
import { Form, Input } from 'antd';
import { Project } from '@stencilbot/renderer';
import { debounce } from 'lodash';

interface ProjectFormProps {
  project: Project
  onSubmit: (project: Project) => void
}

export const ProjectForm: FunctionComponent<ProjectFormProps> = ({ project, onSubmit }) => {
  const [form] = Form.useForm();
  const handleSubmit = debounce(() => {
    onSubmit(new Project(project.width, project.height, project.layers));
  }, 300);

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item label="Dimensions (px)">
        <Input.Group compact style={{ display: 'flex' }}>
          <Input
            type="number"
            placeholder="width"
            defaultValue={project.width}
            onChange={e => {
              project.width = +e.target.value;
              form.submit();
            }}
          />
          <Input disabled placeholder="x" style={{ pointerEvents: 'none', width: 40 }} />
          <Input
            type="number"
            placeholder="heigt"
            defaultValue={project.height}
            onChange={e => {
              project.height = +e.target.value;
              form.submit();
            }}
          />
        </Input.Group>
      </Form.Item>
    </Form>
  )
}