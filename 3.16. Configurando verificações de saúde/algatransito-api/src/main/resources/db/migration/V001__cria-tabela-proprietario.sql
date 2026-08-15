create table proprietario (
    id bigint not null identity,
    nome varchar(60) not null,
    email varchar(255) not null,
    telefone varchar(20) not null,

    constraint pk_proprietario primary key (id)
)

alter table proprietario
add constraint uk_proprietario unique (email)