import { getQiniuToken, getQiniuResourcesUrl } from "@/api/system";
import * as Qiniu from "qiniu-js";
import { ElMessage } from "element-plus";

export class Upload {
  private token: string = '';
  public url: string = '';
  public prefix: string = ''

  constructor() {
    this.getQiniuUrl();
  }

  getToken = async () => {
    const result = await getQiniuToken();
    this.token = result.data
  }

  getQiniuUrl = async () => {
    const result = await getQiniuResourcesUrl();
    this.prefix = result.data
  }

  async uploadFile(file: File) {
    const that = this;
    return new Promise((reject, resolve) => {
      this.getToken().then(() => {
        const token = that.token
        const key = `${new Date().getTime()}_${file.name}`;
        const putExtra = {
          fname: key,
          params: {},
        };
        const config = {
          useCdnDomain: true,
        };
        const observable = Qiniu.upload(file, key, token, putExtra, config);
        const observer = {
          error(err: any) {
            console.log(err);
            resolve(err);
          },
          complete(res: { key: string; }) {
            ElMessage.success("上传成功");
            that.url = that.prefix + res.key;
            reject(that.url);
          }
        };
        observable.subscribe(observer);
      });
    })
  }
}