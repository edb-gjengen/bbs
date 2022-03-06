import { useMutation } from "@apollo/client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { CreateUserDocument } from "../../types";
import styles from "./UserCreate.module.css";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export const UserCreate = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [createUser, { loading: creating }] = useMutation(CreateUserDocument);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await createUser({ variables: data });
    } catch (err) {
      console.error("woops", err);
      return;
    }
    reset();
  };

  return (
    <div>
      <h2>Opprett ny</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <label>Fornavn</label>
        <input {...register("firstName", { required: true })} />
        {errors.firstName && <span>This field is required</span>}
        <label>Etternavn</label>
        <input {...register("lastName", { required: true })} />
        {errors.lastName && <span>This field is required</span>}
        <label>E-post</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <span>This field is required</span>}
        <input type="submit" disabled={creating} className="btn-primary" />
      </form>
    </div>
  );
};
