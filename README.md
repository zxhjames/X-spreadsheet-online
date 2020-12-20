# X-spreadsheet-online 一款轻量级别的在线excel

## 访问地址

[http://106.75.227.222:5001/](http://106.75.227.222:5001/)
## 实现的功能
### 在线设计文档及导出

![](https://github.com/zxhjames/learn_resource/blob/gif/mygif/test3-min.gif?raw=true)
### 自动填充字段导出

![](https://github.com/zxhjames/learn_resource/blob/gif/mygif/test4-min.gif?raw=true)
## 如何安装
* 测试数据库
选择postgres数据库
```sql
create table excelmeta
(
    id       bigserial not null
        constraint excelmeta_pk
            primary key,
    author   text      not null,
    name     text      not null,
    api      text      not null,
    time     text      not null,
    cell     json      not null,
    data     json      not null,
    raw_data text
);

comment on table excelmeta is 'excelmeta配置表';

comment on column excelmeta.id is 'ID号';

comment on column excelmeta.author is '创建人';

comment on column excelmeta.name is '报表名';

comment on column excelmeta.api is '报表的下载地址';

comment on column excelmeta.time is '创建时间';

comment on column excelmeta.cell is '单元格信息';

comment on column excelmeta.data is '单元格数据信息';

comment on column excelmeta.raw_data is '模版配置数据';

alter table excelmeta
    owner to postgres;

create table employee
(
    uid    integer          not null
        constraint employee_pk
            primary key,
    name   text             not null,
    dept   text             not null,
    salary double precision not null
);

comment on table employee is '员工表';

comment on column employee.uid is '工号';

comment on column employee.name is '工名';

comment on column employee.dept is '部门';

comment on column employee.salary is '工资';

alter table employee
    owner to postgres;

create unique index employee_uid_uindex
    on employee (uid);
```
* 后端
```shell
git checkout -b main
git clone https://github.com/zxhjames/X-spreadsheet-online
cd X-spreadsheet-online
修改config目录下config.yaml文件的配置，改成你自己的
修改main中100行代码中的config.yml路径，改为你自己电脑上的绝对路径
go run main.go
```

* 前端
```shell
git checkout -b dev
git clone https://github.com/zxhjames/X-spreadsheet-online
cd X-spreadsheet-online
替换目录下所有请求的ip为localhost,index.html里的数据库连接信息改成自己的
npm install
npm run dev
```

## 微信公众号

![](https://github.com/zxhjames/learn_resource/blob/gongzhonghao/gongzhonghao.jpg?raw=true)

