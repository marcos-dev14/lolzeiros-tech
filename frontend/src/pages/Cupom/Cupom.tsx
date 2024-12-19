import { MeasureBox } from "@/src/components/MeasureBox";
import { TableDateBox } from "@/src/components/TableDateBox";
import { api } from "@/src/services/api";
import { TableActionButton } from "@/src/styles/components/tables";
import React, { useCallback } from "react";
import { useHistory } from "react-router";
import { ReactComponent as DeletIcon } from "~assets/Trash1.svg";
import { ReactComponent as EditIcon } from "~assets/view2.svg";
import {
  CupomCard,
  CupomNameTag,
  WrapperBox,
  WrapperDates,
  WrapperInputCupom,
} from "./styles";

export interface ICupom {
  name: string;
  id: number;
  value?: string;
  porcent?: string;
  cDate: string;
  validate: string;
  url: string;
  setError: (string: string) => void;
  setLoading: (bol: boolean) => void;
}

const Cupom: React.FC<ICupom> = ({
  name,
  value,
  porcent,
  cDate,
  url,
  validate,
  id,
  setError,
  setLoading,
}) => {
  const history = useHistory();

  const handleClick = (id: number) => {
    history.push(`/store/cupons/edit/${id}`);
  };

  const deletCupon = useCallback(
    async (deletId: number) => {
      try {
        setLoading(true);
        await api.delete(`coupons/${deletId}`);
      } catch (error: any) {
        // @ts-ignore
        const errorMessage = !!e.response
          ? // @ts-ignore
            e.response.data.message
          : "Houve um erro.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     gap: "2rem",
    //     padding: "0.5rem",
    //     border: "1px solid #dbecff",
    //   }}
    // >
    //   <img
    //     style={{ maxWidth: "5rem", marginRight: "2rem", opacity: "0.9" }}
    //     src={url}
    //     alt=""
    //   />
    //   <TableTitle
    //     fontSize="0.8rem"
    //     lineHeight="0.8125rem"
    //     style={{ display: "flex", alignItems: "center" }}
    //   >
    //     {name}
    //   </TableTitle>
    <CupomCard>
      <WrapperBox>
        <WrapperInputCupom>
          <CupomNameTag>
            <p>CUPOM:</p>
          </CupomNameTag>
          <input type="text" readOnly value={name} disabled />
        </WrapperInputCupom>
        <MeasureBox
          name="etaSupplier"
          width="3.125rem"
          title=""
          noTitle
          validated
          measure={value ? "R$" : "%"}
          defaultValue={value ?? porcent}
          disabled
        />
      </WrapperBox>

      <WrapperBox>
        <WrapperDates>
          <TableDateBox
            name="Validade"
            title="Validade"
            // @ts-ignore
            showTime={false}
            date={validate}
            onDateSelect={() => {}}
            disabled
            validated={false}
          />
        </WrapperDates>
        <WrapperDates>
          <TableDateBox
            name=""
            title=""
            // @ts-ignore
            showTime={false}
            date={cDate}
            onDateSelect={() => {}}
            disabled
            validated={false}
          />
        </WrapperDates>
        <TableActionButton
          backgroundColor="#36C8B1"
          onClick={() => {
            handleClick(id);
          }}
        >
          <EditIcon />
        </TableActionButton>
        <TableActionButton
          onClick={() => {
            deletCupon(id);
          }}
        >
          <DeletIcon />
        </TableActionButton>
      </WrapperBox>
    </CupomCard>
  );
};

export default Cupom;
