declare type TemplateData = {
    query: string;
    variables: {
        [key: string]: string;
    };
};
declare const templates: {
    [key: string]: TemplateData;
};
export { templates };
