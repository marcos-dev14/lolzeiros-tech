import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { MeasureBox } from "@/src/components/MeasureBox";
import { CustomSelect as Select } from "@/src/components/Select";
import { Tab, TabList, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { ReactComponent as CancelledIcon } from "~assets/cancelled.svg";
import { ReactComponent as NewIcon } from "~assets/new.svg";
import { ReactComponent as PaidIcon } from "~assets/paid.svg";
import { ReactComponent as PausedIcon } from "~assets/paused.svg";
import { ReactComponent as PdfIcon } from "~assets/pdf-ico.svg";
import { ReactComponent as ReceivedIcon } from "~assets/received.svg";
import { ReactComponent as SortIcon } from "~assets/sort.svg";
import { ReactComponent as TruckIcon } from "~assets/truck.svg";
import { ReactComponent as EditIcon } from "~assets/view1.svg";
import { Header } from "~components/Header";
import { Menu } from "~components/Menu";
import { Pagination } from "~components/Pagination";
import { SearchBox } from "~components/SearchBox";
import { TableDateBox } from "~components/TableDateBox";

import { InputContainer, MenuAndTableContainer } from "~styles/components";
import {
  BoxModal,
  Button,
  ButtonCleanerFilters,
  ButtonFilter,
  Container,
  Table,
  TableHeader,
} from "./styles";

import {
  TableActionButton,
  TableFooter,
  TableSortingHeader,
  TableTitle,
} from "~styles/components/tables";

import { api } from "~api";

import { ErrorModal } from "@/src/components/ErrorModal";
import { Modal } from "@/src/components/Modal";
import { TableLoadingContainer } from "@/src/components/TableLoadingContainer";
import { Order, useOrder } from "@/src/context/order";
import { DefaultValueProps } from "@/src/types/main";
import { sortByField, sortNumberFields } from "~utils/sorting";
import { isOnSafari } from "~utils/validation";
import { Badge } from "../Store/Sales/styles";
import { EditButton } from "./Edit/styles";
import CustomInputDate from "@/src/components/CustonImputData";

export const handleOrderResume = (id: any) => {
  const newTab = window.open(`/finances/invoices/${id}`, "_blank");
  if (newTab) {
    newTab.focus();
  }
};

export function Finances() {
  const { push } = useHistory();

  const [filteredCampaigns, setFilteredCampaigns] = useState<Order[]>();
  const { orderData, setOrderData } = useOrder();
  const [showNoResultsError, setShowNoResultsError] = useState(false);

  //ESTADOS ATUAIS DO FILTRO

  const [seller, setSeller] = useState<string>();
  const [supplier, setSupplier] = useState<string>();
  const [hasFiltered, setHasFiltered] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSellerChecked, setIsSellerChecked] = useState(false);
  const [isSupplierChecked, setIsSupplierChecked] = useState(false);
  const [allSuppliers, setAllSuppliers] = useState<DefaultValueProps[]>();
  const [allSellers, setAllSellers] = useState<DefaultValueProps[]>();
  const [initialDate, setInitialDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");

  // FINAL ESTADOS ATUAIS DO FILTRO

  const [currentOrdersType, setCurrentOrdersType] = useState<string>("Abertos");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [error, setError] = useState("");

  const [sortingField, setSortingField] = useState("");

  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const [filtro, setFiltro] = useState<any>({
    value: "supplier",
    label: "Comercial",
  });

  const handleSearch = useCallback((search: string) => {
    const searchString = search.toLowerCase();

    setCurrentPage(1);
    setSearchTerm(search.toLowerCase());
  }, []);

  const handleClearSearch = () => {
    setCurrentPage(1);
    setSearchTerm(null);
    setSupplier("");
    setSeller("");
    setFiltro("");
  };

  const handleFetch = async () => {
    try {
      setLoading(true);

      const endpointMap: Record<string, string> = {
        Recebidos: "only_received",
        Abertos: "only_new",
        Cancelados: "only_canceled",
        Transmitidos: "only_transmitted",
      };

      let url = `invoices/orders?${endpointMap[currentOrdersType]}=${currentOrdersType !== "Faturados" ? "true" : "false"
        }&page=${currentPage}&paginated=true&search=${searchTerm || ""}`;

      if (filtro.value === "supplier" && supplier) {
        url += `&supplier=${supplier}`;
      } if (isSellerChecked) {
        url += `&seller=${seller}`;
      }

      if (initialDate) {
        url += `&dateStart=${encodeURIComponent(initialDate)}`;
      }

      if (finalDate) {
        url += `&dateEnd=${encodeURIComponent(finalDate)}`;
      }

      const {
        data: {
          data: {
            data: results,
            meta: { current_page, last_page },
          },
        },
      } = await api.get(url);

      setFilteredCampaigns(results);
      setCurrentPage(current_page);
      setLastPage(last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const filtersFetch = async () => {
    try {
      const suppliersData = await api.get("/products/suppliers");
      const suppliers = suppliersData.data.data;

      const sellersData = await api.get("/sellers");
      const sellers = sellersData.data.data;

      if (Array.isArray(suppliers) && Array.isArray(sellers)) {
        const suppliersData = suppliers.map((supplier) => ({
          value: supplier.id,
          label: supplier.name,
        }));
        const sellersData = sellers.map((seller) => ({
          value: seller.id,
          label: seller.name,
        }));
        setAllSuppliers(suppliersData);
        setAllSellers(sellersData);
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  useEffect(() => {
    try {
      setLoading(true);
      handleFetch();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentOrdersType, searchTerm]);

  const currentIcon = useCallback((status: string) => {
    switch (status) {
      case "Novo":
        return <NewIcon />;
      case "Recebido":
        return <ReceivedIcon />;
      case "Transmitido":
        return <NewIcon />;
      case "Faturado":
        return <PaidIcon />;
      case "Pausado":
        return <PausedIcon />;
      case "Cancelado":
        return <CancelledIcon style={{ height: "0.5rem" }} />;
      default:
        return <TruckIcon />;
    }
  }, []);

  const newInvoices = async () => {
    try {
      const response = await api.post(`invoices/create/${selectedOrderId}`);

      // eslint-disable-next-line no-restricted-globals
      setOrderData(null);
      push(`/finances/invoices/${selectedOrderId}`);
      return response.data;
    } catch (error) {
      console.error("Erro na requisição:", error);

      throw new Error("Erro na requisição");
    }
  };

  const pdfExport = async (id: number) => {
    try {
      const response = await api.get(`invoices/pdf/export/${id}`, {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);

      link.download = `pedido_${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error fetching or downloading PDF:", error);
    }
  };

  const handleButtonClick = (type: string) => {
    setLoading(true);
    setCurrentOrdersType(type);
    setCurrentPage(1);
  };

  const handlePagination = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setCurrentPage(page);
    } catch (error) {
      console.log("Error during pagination:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSortingByField = useCallback(
    ({ value, type = "string" }) => {
      if (sortingField.includes(value)) {
        setFilteredCampaigns(filteredCampaigns?.reverse());

        sortingField.includes("-desc")
          ? setSortingField((prev) => prev.replace("-desc", ""))
          : setSortingField((prev) => `${prev}-desc`);

        return;
      }

      if (type === "string")
        // @ts-ignore

        setFilteredCampaigns((prev) => sortByField(prev, value));
      else {
        // @ts-ignore

        setFilteredCampaigns((prev) => sortNumberFields(prev, value));
      }
      setSortingField(value);
    },
    [filteredCampaigns, sortingField]
  );

  const usingSafari = useMemo(() => isOnSafari, []);

  const handleFilterStatus = () => {
    filtersFetch();
    if (!hasFiltered) {
      setIsFilterModalOpen(true);
      return;
    }
  };

  return (
    <>
      <Header route={["Resumo Pedido"]} />
      <MenuAndTableContainer>
        <Menu />

        <Container>
          <InputContainer>
            {/* <Select
              title="Filtro"
              customWidth="9.375rem"
              data={[
                { value: "supplier", label: "Fornecedor" },
                { value: "seller", label: "Comercial" },
              ]}
              disabled={loading}
              setValue={(value: string) => setFiltro({ value, label: value })}
            /> */}

            <SearchBox
              search={handleSearch}
              onClear={() => handleClearSearch()}
            />

            <Button onClick={handleFilterStatus} disabled={loading}>
              {hasFiltered ? "Limpar Filtro" : "Filtro"}
            </Button>

            <Modal
              title="Filtragem"
              isModalOpen={isFilterModalOpen}
              setIsModalOpen={setIsFilterModalOpen}
              customOnClose={() => {
                setIsSellerChecked(false);
                setIsSupplierChecked(false);
              }}
            >
              {/* {filtro.label === "supplier" && ( */}
              <BoxModal>
                <div
                  style={{
                    display: "flex",
                    gap: "0.3rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setIsSupplierChecked(event.target.checked);
                      console.log(event.target.checked);
                      console.log(!isSupplierChecked);
                    }}
                  />
                  <label
                    style={{
                      fontSize: ".8rem",
                      textTransform: "uppercase",
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                    }}
                  >
                    Fornecedor
                  </label>
                </div>

                <div style={{ display: "flex", gap: "0.3rem" }}>
                  <input
                    type="checkbox"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setIsSellerChecked(event.target.checked);
                    }}
                  />
                  <label
                    style={{
                      fontSize: ".8rem",
                      textTransform: "uppercase",
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                    }}
                  >
                    Comercial
                  </label>
                </div>
              </BoxModal>

              <BoxModal>
                <Select
                  title="Fornecedor"
                  customWidth="100%"
                  setValue={(value: any) => {
                    setSupplier(value);
                  }}
                  data={allSuppliers}
                  disabled={!isSupplierChecked}
                />
              </BoxModal>
              <BoxModal>
                <Select
                  title="Comercial"
                  customWidth="100%"
                  setValue={(value: any) => {
                    setSeller(value);
                  }}
                  data={allSellers}
                  disabled={!isSellerChecked}
                />
              </BoxModal>
              <BoxModal>
                <div>
                  <label
                    style={{
                      fontSize: "0.5rem",
                      lineHeight: "1rem",
                      textTransform: "uppercase",
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                    }}
                  >
                    Data Inicio
                  </label>
                  <CustomInputDate
                    showTime={false}
                    onDateSelect={(formattedDate) => {
                      setInitialDate(formattedDate);
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "0.5rem",
                      lineHeight: "1rem",
                      textTransform: "uppercase",
                      fontFamily: "Roboto",
                      fontWeight: "bold",
                    }}
                  >
                    Data Final
                  </label>
                  <CustomInputDate
                    showTime={false}
                    onDateSelect={(formattedDate) => {
                      setFinalDate(formattedDate);
                    }}
                  />
                </div>
              </BoxModal>

              <BoxModal style={{ marginTop: "1rem" }}>
                <ButtonCleanerFilters onClick={() => handleClearSearch()}>
                  Limpar Filtros
                </ButtonCleanerFilters>

                <ButtonFilter
                  onClick={() => handleFetch()}
                >
                  Aplicar Filtros
                </ButtonFilter>
              </BoxModal>
            </Modal>

            <EditButton
              type="button"
              className="Edit"
              style={{ fontSize: "1rem" }}
              onClick={() => newInvoices()}
              disabled={selectedOrderId === null}
            >
              <p>Criar Faturamento</p>
            </EditButton>
          </InputContainer>

          <TableHeader
            style={{
              marginTop: "2rem",
              borderBottom: "2px solid #3699CF",
              borderTop: "2px solid #3699CF",
              padding: "1rem",
            }}
          >
            <div style={{ width: "100%" }}>
              <Tabs style={{ height: "3rem", width: "100%" }}>
                <TabList style={{ height: "100%", display: "flex" }}>
                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Abertos"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    selected={currentOrdersType === "Abertos"}
                    onClick={() => handleButtonClick("Abertos")}
                  >
                    <Badge status={"Novo"}>
                      {currentIcon("Novo")}
                      Novo
                    </Badge>
                  </Tab>
                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Recebidos"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleButtonClick("Recebidos")}
                  >
                    <Badge status={"Recebido"}>
                      {currentIcon("Recebido")}
                      Recebidos
                    </Badge>
                  </Tab>
                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Transmitidos"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleButtonClick("Transmitidos")}
                  >
                    <Badge status={"Transmitido"}>
                      {currentIcon("Transmitido")}
                      Transmitido
                    </Badge>
                  </Tab>
                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Pausado"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleButtonClick("Pausados")}
                  >
                    <Badge status={"Pausado"}>
                      {currentIcon("Pausado")}
                      Pausado
                    </Badge>
                  </Tab>
                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Faturados"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleButtonClick("Faturados")}
                  >
                    <Badge status={"Faturado"}>
                      {currentIcon("Faturado")}
                      Faturado
                    </Badge>
                  </Tab>

                  <Tab
                    style={{
                      borderColor:
                        currentOrdersType === "Cancelados"
                          ? "rgb(54, 153, 207)"
                          : "",
                      color: "white",
                      display: "flex",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleButtonClick("Cancelados")}
                  >
                    <Badge status={"Cancelado"}>
                      {currentIcon("Cancelado")}
                      Cancelado
                    </Badge>
                  </Tab>
                </TabList>
              </Tabs>
            </div>

            {showNoResultsError && (
              <p style={{ color: "red", marginTop: "1rem" }}>
                Nenhum resultado encontrado.
              </p>
            )}
          </TableHeader>

          <Table isOnSafari={usingSafari} style={{ marginTop: "0.25rem" }}>
            <colgroup>
              <col span={1} style={{ width: "9%" }} />
              <col span={1} style={{ width: "12%" }} />
              <col span={1} style={{ width: "26%" }} />
              <col span={1} style={{ width: "13%" }} />
              <col span={1} style={{ width: "12%" }} />
              <col span={1} style={{ width: "12%" }} />
              <col span={1} style={{ width: "12%" }} />
              <col span={1} style={{ width: "4%" }} />
            </colgroup>
            <thead>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("code") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "code" })}
                >
                  Código
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("external_order_id") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "external_order_id" })}
                >
                  Cod. Externo
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("created") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "created" })}
                >
                  Data Pedido
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("client") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "client" })}
                >
                  Cliente
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("cnpj") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "cnpj" })}

                >
                  CNPJ
                  <SortIcon />

                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("status") ? sortingField : "asc"}
                >
                  Status
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("nfe") ? sortingField : "asc"}
                  onClick={() => handleSortingByField({ value: "nfe" })}
                >
                  Nfe
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>
                <TableSortingHeader
                  dir={sortingField.includes("value") ? sortingField : "asc"}
                  onClick={() =>
                    handleSortingByField({ value: "value", type: "number" })
                  }
                >
                  Valor Pedido
                  <SortIcon />
                </TableSortingHeader>
              </th>
              <th>Ação</th>
            </thead>

            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={8}>
                    <TableLoadingContainer content="os dados" />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredCampaigns?.map((p) => (
                  <tr key={p.id}>
                    <td>{p.code}</td>
                    <td>
                      {
                        // @ts-ignore
                        p?.external_order_id ?? "Não Cadast."
                      }
                    </td>
                    <td style={{ padding: "0 0.625rem" }}>
                      <TableDateBox
                        name=""
                        title=""
                        width="7.5rem"
                        // @ts-ignore
                        showTime={false}
                        date={p.created}
                        onDateSelect={() => { }}
                        disabled
                        validated={false}
                      />
                    </td>
                    <td style={{ minWidth: "11rem" }}>{p.client}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{p.cnpj}</td>
                    <td>
                      <TableTitle fontSize="0.6875rem" lineHeight="0.8125rem">
                        {/* @ts-ignore */}
                        <Badge status={p.status}>
                          {/* @ts-ignore */}
                          {currentIcon(p.status)}
                          <p>{p.status}</p>
                        </Badge>
                      </TableTitle>
                    </td>
                    <td>
                      {
                        // @ts-ignore
                        p.invoice[0]?.number ?? ""
                      }
                    </td>
                    <td style={{ padding: "0 0.625rem" }}>
                      <MeasureBox
                        name="etaSupplier"
                        title=""
                        noTitle
                        validated
                        measure="R$"
                        defaultValue={p.value}
                        disabled
                      />
                    </td>
                    <td>
                      <div>
                        <TableActionButton
                          onClick={() => handleOrderResume(p.id)}
                        >
                          <EditIcon />
                        </TableActionButton>
                        <TableActionButton onClick={() => pdfExport(p.id)}>
                          <PdfIcon />
                        </TableActionButton>

                        <TableActionButton>
                          <input
                            type="checkbox"
                            checked={selectedOrderId === p.id}
                            onChange={() => setSelectedOrderId(p.id)}
                          />
                        </TableActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>

          {!loading && lastPage > 1 && (
            <TableFooter>
              <p />

              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                setCurrentPage={handlePagination}
              />
            </TableFooter>
          )}
        </Container>
      </MenuAndTableContainer>
      <ErrorModal error={error} setIsModalOpen={() => setError("")} />
    </>
  );
}