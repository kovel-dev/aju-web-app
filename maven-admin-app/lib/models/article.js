import axios from 'axios'
import { server } from '../config/server'
import { validateArticleForm } from '../validations/article-validations'

class Article {
  constructor(data) {
    this.title = data.title || ''
    this.description = data.description || ''
    this.short_description = data.short_description || ''
    this.image_url = data.image_url || ''
    this.link = data.link || ''
    this.status = data.status || 'active'
    this.is_featured = data.is_featured || false
    this.deleted_at = data.deleted_at || ''
    this.created_at = data.created_at || ''
    this.created_by = data.created_by || ''
    this.updated_at = data.updated_at || ''
    this.updated_by = data.updated_by || ''
  }

  getValues = () => {
    return {
      title: this.title,
      description: this.description,
      short_description: this.short_description,
      image_url: this.image_url,
      link: this.link,
      status: this.status,
      is_featured: this.is_featured,
      deleted_at: this.deleted_at,
      created_at: this.created_at,
      created_by: this.created_by,
      updated_at: this.updated_at,
      updated_by: this.updated_by,
    }
  }

  getStatuses = () => {
    return {
      active: 'Active',
      inactive: 'Inactive',
    }
  }

  validate = async () => {
    return await validateArticleForm(this.getValues())
      .then(function (value) {
        return value
      })
      .catch(function (error) {
        throw error
      })
  }

  save = async () => {
    await this.validate()

    return await axios
      .post(`${server}/api/articles/create`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  update = async (refNumber) => {
    await this.validate()

    return await axios
      .post(`${server}/api/articles/${refNumber}/update`, this.getValues())
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  activate = async (refNumber) => {
    return await axios
      .post(`${server}/api/articles/${refNumber}/activate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  deactivate = async (refNumber) => {
    return await axios
      .post(`${server}/api/articles/${refNumber}/deactivate`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }

  //   getList = async (pageNumber, limit) => {
  //     return await axios
  //       .get(`${server}/api/articles/list?page=${pageNumber}&limit=${limit}`)
  //       .then((response) => {
  //         const data = response.data.result.data;
  //         const count = response.data.count;
  //         const articles = [];

  //         for (const key in data) {
  //           const article = {
  //             id: key,
  //             label: data[key][0],
  //             type: data[key][1].toUpperCase(),
  //             options: data[key][2].toUpperCase(),
  //             status: data[key][3].toUpperCase(),
  //             ref: data[key][4]["@ref"]["id"],
  //           };

  //           articles.push(article);
  //         }

  //         return {
  //           data: articles,
  //           count: count
  //         };
  //       })
  //       .catch(function (error) {
  //         throw error;
  //       });
  //   }

  getArticleByRef = async (refNumber) => {
    return await axios
      .post(`${server}/api/articles/get-article-by-ref`, { ref: refNumber })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  static getSchema(isEdit) {
    return [
      {
        type: 'heading',
        title: 'Article Information',
        subHeading: 'This information will be used to create article.',
      },
      {
        type: 'textbox',
        label: 'Title',
        id: 'title',
        name: 'title',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textarea',
        label: 'Description',
        id: 'description',
        name: 'description',
        isRequired: true,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Short Description',
        id: 'short_description',
        name: 'short_description',
        isRequired: true,
        width: 1,
      },
      {
        type: 'file',
        label: 'Image',
        id: 'image_url',
        name: 'image_url',
        isRequired: false,
        width: 1,
      },
      {
        type: 'textbox',
        label: 'Link',
        id: 'link',
        name: 'link',
        isRequired: true,
        width: 1,
      },
      {
        type: 'select',
        label: 'Status',
        id: 'status',
        name: 'status',
        isRequired: true,
        options: [
          { key: 'active', value: 'Active' },
          { key: 'inactive', value: 'Inactive' },
        ],
      },
      {
        type: 'select',
        label: 'Featured',
        id: 'is_featured',
        name: 'is_featured',
        isRequired: true,
        options: [
          { key: 'yes', value: 'Yes' },
          { key: 'no', value: 'No' },
        ],
      },
      {
        type: 'form-action-buttons',
        submitLabel: isEdit ? 'Edit Article' : 'Create Article',
      },
    ]
  }
}

export default Article
