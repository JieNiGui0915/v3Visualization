import type {FormInstance} from "element-plus";
import {ref} from "vue";

interface FormRef extends FormInstance {
}

interface Ref<U> extends ref<U> {
}

interface PageResult<T> {
  PageNum: number,
  PageSize: number,
  Total: number,
  DataList: T[]
}
