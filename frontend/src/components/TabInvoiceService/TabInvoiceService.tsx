import { ImportPdfPlus } from '@/src/components/ImportPdf/importPdfPlus';
import { InputContainer, SectionTitle } from "@/src/styles/components";
import { ChangeEvent, useCallback, useState } from "react";
import { Tab, TabList } from "react-tabs";
import { Modal } from "../Modal";
import { CancelButton, EditButton } from "@/src/pages/Finances/Edit/styles";
import { TableActionButton } from "@/src/styles/components/tables";
import { FormInput } from '../FormInput';
import { DateBox } from '../DateBox';
import { MeasureBox } from '../MeasureBox';
import { InvoiceBillet, formDataAtt, invoiceInterface } from '@/src/pages/Finances/Edit';
import { ReactComponent as RedIcon } from '~assets/Close-filter.svg';
import { ReactComponent as TrashIcon } from '~assets/trash.svg';
import { ReactComponent as DownloadIcon } from '~assets/download.svg';
import { ReactComponent as EditIcon } from '~assets/edit1.svg';
import icone from './Icone.svg'
import { api } from '@/src/services/api';
import { useHistory } from 'react-router';
import { FormSelect } from '../FormSelect';


interface InvoiceTabsProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>, name: string) => void;
    status?: number
    formValues: formDataAtt;
    invoiceData?: invoiceInterface;
    updateBilletObservation: (number: number) => void;
    updateBillets: (invoiceId: number, i: number, f: number, t: number) => void;
    onPayDateChange: (value: string, id: number, field: string) => void;
    handleObservationChange: (event: React.ChangeEvent<HTMLInputElement>, billetId: number, field: string) => void;
    handleUnPaidBillet: (id: number) => void;
    billetObservations: Record<number, InvoiceBillet>;
    billetStatus: Record<number, InvoiceBillet>;
    sumDiscount?: string;
    sValue?: string;
    pValue?: string;

}

const dataSelect = [{ value: 'Fornecedor', label: 'Fornecedor' },
{ value: 'Cliente', label: "Cliente" },
{ value: 'Vendedor', label: 'Vendedor' }
];



const InvoiceTabs: React.FC<InvoiceTabsProps> = ({
    handleInputChange,
    formValues,
    status,
    invoiceData,
    updateBillets,
    updateBilletObservation,
    handleObservationChange,
    onPayDateChange,
    handleUnPaidBillet,
    sumDiscount,
    sValue,
    pValue,
    billetObservations,
    billetStatus

}) => {
    const [showParcelamento, setShowParcelamento] = useState(true);
    const [showPDF, setShowPDF] = useState(false);
    const [showLog, setShowLog] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdf, setPdf] = useState<boolean>(false);

    const handleToggleParcelamento = () => {
        setShowParcelamento(true);
        setShowLog(false)
        setShowPDF(false);
    };

    const handleTogglePDF = () => {
        setShowParcelamento(false);
        setShowPDF(true);
        setShowLog(false)

    };

    const handleToggleLog = () => {
        setShowParcelamento(false);
        setShowPDF(false);
        setShowLog(true)
    };

    const handleUploadSuccess = () => {
        console.log('Upload bem-sucedido! Faça o que precisar aqui.');
    };

    const deletePdf = async (invoiceId: number) => {
        try {
            await api.delete(`invoices/pdf/delete/${invoiceId}`);
            setPdf(!pdf)
            setIsOpen(false)

        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    const abrirNovaJanela = async (parametro: string) => {
        try {

            const response = await api.get(`/invoices/pdf/download/${parametro}`, { responseType: 'arraybuffer' });


            const contentType = response.headers['content-type'];


            const blob = new Blob([response.data], { type: contentType });


            const novaUrl = URL.createObjectURL(blob);

            window.open(novaUrl, '_blank');
        } catch (error) {

            console.error('Erro ao abrir a nova janela:', error);
        }
    };

    return (
        <div>

            <InputContainer style={{ alignItems: 'center', gap: '1rem' }}>
                <TabList style={{ width: '100%', borderColor: "rgb(120, 197, 240)" }}>
                    <Tab
                        style={{
                            backgroundColor: showParcelamento ? '#78C5F0' : '',
                            cursor: 'pointer',
                            borderTopRightRadius: '5rem',
                            color: showParcelamento ? 'white' : '#78C5F0'
                        }}
                        onClick={handleToggleParcelamento}
                    >
                        Parcelamento
                    </Tab>
                    <Tab
                        style={{
                            backgroundColor: showPDF ? '#78C5F0' : '',
                            cursor: 'pointer',
                            borderTopRightRadius: '5rem',
                            color: showPDF ? 'white' : '#78C5F0'
                        }}
                        onClick={handleTogglePDF}
                    >
                        Arquivos
                    </Tab>
                    <Tab
                        style={{
                            backgroundColor: showLog ? '#78C5F0' : '',
                            cursor: 'pointer',
                            borderTopRightRadius: '5rem',
                            color: showLog ? 'white' : '#78C5F0'
                        }}
                        onClick={handleToggleLog}
                    >
                        Logs
                    </Tab>
                </TabList>
            </InputContainer>

            <div style={{ display: showParcelamento ? 'block' : 'none' }}>
                <div style={{ padding: '2rem', backgroundColor: 'rgb(220 240 251)' }}>
                    <SectionTitle style={{ marginTop: '1.25rem' }}>
                        Reparcelamentos de Títulos
                    </SectionTitle>
                    <InputContainer>
                        <FormInput
                            type='number'
                            name="numberOfBillets"
                            title="Número de Parcelas"
                            width="5.6875rem"
                            onChange={(event) => handleInputChange(event, 'numberOfBillets')}
                            value={formValues?.numberOfBillets}

                        />
                        <FormInput
                            type='number'
                            name="firstPayment"
                            title=" Dias para Início do PG"
                            width="5.6875rem"
                            onChange={(event) => handleInputChange(event, 'firstPayment')}
                            value={formValues?.firstPayment}
                        />
                        <FormInput
                            name="paymentTerm"
                            title="Intervalo entre as Parcelas"
                            width="25.6875rem"
                            style={{ textAlign: 'center' }}
                            onChange={(event) => handleInputChange(event, 'paymentTerm')}
                            value={formValues?.paymentTerm}

                        />
                        <EditButton
                            type="button"
                            className="Edit"
                            onClick={() => setIsModalOpen(true)}
                            disabled={!formValues?.numberOfBillets || !formValues?.firstPayment || !formValues.paymentTerm || formValues.status !== 1}
                        >

                            <p>Parcelamento</p>
                        </EditButton>



                        <Modal
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            customOnClose={() => {
                                setIsModalOpen(false)
                            }}
                        >
                            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Atualizar  as Parcelas?</h2>
                            <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                                <EditButton
                                    onClick={() =>
                                        invoiceData?.id !== undefined ?
                                            updateBillets(invoiceData.id, formValues?.numberOfBillets, formValues?.firstPayment, formValues?.paymentTerm)
                                            : null}                  >
                                    Confirmar
                                </EditButton>
                                <CancelButton onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </CancelButton>
                            </div>
                        </Modal>


                    </InputContainer>
                    <InputContainer>
                        <MeasureBox
                            name="value"
                            title="Valor Original"
                            measure="R$"
                            width="8rem"
                            value={formValues?.value}
                            disabled

                        />

                        <MeasureBox
                            name="discount"
                            title="Desconto/Juros"
                            measure="R$"
                            width="5.5rem"
                            disabled
                            value={sumDiscount}
                        />

                        <MeasureBox
                            name="value"
                            title="Valor Real Pago"
                            measure="R$"
                            width="8rem"
                            value={sValue}
                            disabled

                        />
                        <MeasureBox
                            name="value"
                            title=" Valor à PG"
                            measure="R$"
                            width="8rem"
                            value={pValue}
                            disabled
                        />
                    </InputContainer>
                </div>
                {
                    invoiceData?.invoice_billets.map((billet, index) => (
                        <div key={index} style={{ backgroundColor: billet.paid_at !== null ? '#EBECF0' : 'none', borderRadius: '8px', padding: '0.5rem', marginTop: '0.25rem' }}>
                            <SectionTitle style={{ marginTop: '1.25rem' }}>
                                <p style={{ color: "#1279B1" }}>- Parcela {index + 1}</p>
                            </SectionTitle>
                            <InputContainer>
                                <FormInput
                                    name="name"
                                    title="Pedido"
                                    width="8.6875rem"
                                    value={invoiceData.order.code}
                                    disabled
                                />

                                <FormInput
                                    name="name"
                                    title="Número Título"
                                    width="8.6875rem"
                                    disabled
                                    value={`${billet.number}`}
                                />

                                <DateBox
                                    name="order_date"
                                    title="Vencimento Título"
                                    width="6rem"
                                    validated={false}
                                    noMinDate={true}
                                    disabled
                                    hasHour={false}
                                    initialDate={billet.due_date}
                                    showVencidaIndicator={billet.due_date < billet.paid_at}
                                />

                                <DateBox
                                    name="paid_commission"
                                    title="Provisão PG Auge"
                                    width="6rem"
                                    validated={false}
                                    hasHour={false}
                                    noMinDate={true}
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                    initialDate={billetObservations[billet.id].paid_commission ?? new Date().toISOString()}
                                    onDateChange={(event) => onPayDateChange(event, billet.id, 'paid_commission')}
                                />

                                <FormSelect
                                    name="title_bearer"
                                    title="Portador"
                                    customWidth={'8rem'}
                                    placeholder="Selecione..."
                                    data={dataSelect}
                                    disabled={status !== 1}
                                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleObservationChange(event, billet.id, 'title_bearer')}
                                    customValue={{ value: billet?.title_bearer, label: billet?.title_bearer }}
                                />

                                <DateBox
                                    name="paid_commercial"
                                    title="Provisão PG Comercial"
                                    width="6rem"
                                    validated={false}
                                    noMinDate={true}
                                    hasHour={false}
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                    initialDate={billetObservations[billet.id].paid_commercial ?? new Date().toISOString()}
                                    onDateChange={(event) => onPayDateChange(event, billet.id, 'paid_commercial')}

                                />

                                <DateBox
                                    name="paid_at"
                                    title="QUITAÇÃO tÍTULO"
                                    width="6rem"
                                    validated={false}
                                    hasHour={false}
                                    noMinDate={true}
                                    initialDate={billetObservations[billet.id].paid_at ?? billetObservations[billet.id].due_date}
                                    onDateChange={(event) => onPayDateChange(event, billet.id, 'paid_at')}
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                    showVencidaIndicator={billet.due_date < billet.paid_at}

                                />

                            </InputContainer>
                            <InputContainer>

                                <MeasureBox
                                    name="discount"
                                    title="Desconto/Juros"
                                    measure="R$"
                                    width="5.5rem"
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                    value={billetObservations[billet.id].discount ?? ''}
                                    onChange={(event) => handleObservationChange(event, billet.id, 'discount')}
                                />

                                <MeasureBox
                                    name="icms"
                                    title="Valor Original"
                                    measure="R$"
                                    width="5.5rem"
                                    value={billet.value}
                                    disabled
                                />

                                <MeasureBox
                                    name="discounted_price"
                                    title=" Valor Real Pago"
                                    measure="R$"
                                    width="5.5rem"
                                    value={billetObservations[billet.id].discounted_price ?? billet.value}
                                    onChange={(event) => handleObservationChange(event, billet.id, 'discounted_price')}
                                    disabled={status !== 1}

                                />

                                <MeasureBox
                                    name="percentage_commission"
                                    title="Porcentagem Auge"
                                    measure="%"
                                    width="5.5rem"
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                    value={billetObservations[billet.id].percentage_commission}
                                    onChange={(event) => handleObservationChange(event, billet.id, 'percentage_commission')}
                                />
                                <MeasureBox
                                    name="icms"
                                    title="Comissão Auge"
                                    measure="R$"
                                    width="5.5rem"
                                    value={billet.commission}
                                    disabled
                                />
                                <MeasureBox
                                    name="commercial_percentage"
                                    title="Porcentagem Comercial"
                                    measure="%"
                                    width="5.5rem"
                                    value={billetObservations[billet.id].commercial_percentage}
                                    onChange={(event) => handleObservationChange(event, billet.id, 'commercial_percentage')}
                                    disabled={billetStatus[billet.id].paid_at !== null || status !== 1}
                                />
                                <MeasureBox
                                    name="icms"
                                    title="Comissão Comercial"
                                    measure="R$"
                                    width="5.5rem"
                                    value={billet.commercial_commission}
                                    disabled
                                />
                                {
                                    billetStatus[billet.id].paid_at === null ?

                                        <TableActionButton style={{ marginTop: '1rem', marginLeft: '2rem' }} onClick={() => updateBilletObservation(
                                            billet.id
                                        )}
                                        >
                                            <EditIcon />
                                        </TableActionButton> :


                                        <TableActionButton style={{ marginTop: '1rem', marginLeft: '2rem' }}
                                            onClick={() => handleUnPaidBillet(billet.id)}
                                        >
                                            <RedIcon />
                                        </TableActionButton>
                                }

                            </InputContainer>
                            <InputContainer>
                                <FormInput
                                    name="observation"
                                    title="Observação"
                                    width="69.875rem"
                                    disabled={status !== 1}
                                    value={billetObservations[billet.id].observation || ''}
                                    onChange={(event) => handleObservationChange(event, billet.id, 'observation')}
                                />
                            </InputContainer>

                        </div>)
                    )}
            </div>
            <div style={{ display: showLog ? 'block' : 'none' }}>
                <SectionTitle style={{ marginTop: '1.25rem' }}>
                    Alterações
                </SectionTitle>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', gap: '0.5rem' }}>
                    {
                        invoiceData?.invoices_logs?.map((log) =>
                            <div key={log.id} style={{ display: 'flex', gap: '3rem', padding: '0.5rem', backgroundColor: 'rgb(220, 240, 251)', alignItems: 'center', borderRadius: '1rem' }}>
                                <DateBox
                                    name="datalog"
                                    title="Data"
                                    width="7rem"
                                    validated={true}
                                    hasHour={false}
                                    noMinDate={true}
                                    disabled
                                    initialDate={log.created_at !== null ? log.created_at : ''}
                                />
                                {/* <FormInput title='usuario' disabled name='namelog' value={log.user.name} /> */}
                                <FormInput width='44rem' title='Alterações' disabled name='mod' value={log.mod} />

                            </div>
                        )
                    }
                </div>
            </div>
            <div style={{ display: showPDF ? 'block' : 'none' }}>
                <SectionTitle style={{ marginTop: '1.25rem' }}>
                    Gerenciar Arquivos
                </SectionTitle>
                <InputContainer>
                    {
                        // @ts-ignore
                        <ImportPdfPlus style={{ width: "10rem" }} onUploadSuccess={handleUploadSuccess} invoiceId={invoiceData?.id} />
                    }

                </InputContainer>
                <SectionTitle style={{ marginTop: '1.25rem' }}>
                    Arquivos Importados
                </SectionTitle>

                <InputContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {invoiceData?.pdfs_imports?.map(p =>
                        <div style={{ border: '2px solid #00FF00', alignItems: 'center', padding: '1rem', borderRadius: '0.8rem' }}>
                            <img src={icone} alt="arq" style={{ maxWidth: '8rem' }} />
                            <h2 style={{ fontSize: '0.8rem', overflow: 'scroll', width: '8rem' }}>{p.name}</h2>
                            <div style={{ width: '5rem', margin: 'auto' }}>
                                <TableActionButton
                                    onClick={() =>
                                        // @ts-ignore
                                        setIsOpen(true)
                                    }
                                >
                                    <TrashIcon />
                                </TableActionButton>
                                <TableActionButton
                                    onClick={() =>
                                        // @ts-ignore
                                        abrirNovaJanela(p.id)
                                    }
                                >
                                    <DownloadIcon />
                                </TableActionButton>
                            </div>

                            <Modal
                                isModalOpen={isOpen}
                                setIsModalOpen={setIsOpen}
                                customOnClose={() => {
                                    setIsOpen(false)
                                }}
                            >
                                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Deletar Arquivo?</h2>
                                <div style={{ display: 'flex', flexDirection: 'row', margin: 'auto' }}>
                                    <EditButton
                                        onClick={() =>
                                            // @ts-ignore

                                            deletePdf(p.id)}                  >
                                        Confirmar
                                    </EditButton>
                                    <CancelButton onClick={() => setIsOpen(false)}>
                                        Cancelar
                                    </CancelButton>
                                </div>
                            </Modal>


                        </div>
                    )}

                </InputContainer>

            </div>
        </div>
    );
};

export default InvoiceTabs;
