import React, { useState, useEffect } from "react"
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { useParams } from "react-router-dom";
import { getSession } from "../../services/auth";
import api from "../../services/api";

const styles = StyleSheet.create({
    page: {
        display: "flex",
        flexDirection: 'column',
        width: "90%",
        fontSize: 10,
        paddingTop: "7vh",
        paddingRight: "5vh",
        paddingBottom: "5vh",
        paddingLeft: "7vh",
    },
    titulo: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingBottom: 3
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        paddingLeft: 2,
        paddingRight: 2,
        fontSize: 10
    },
    image: {
        height: 50,
        width: 100,
        marginRight: 30
    },
});

const Relatorio = () => {
    const [dados, setDados] = useState([]);
    const { dataInicio, dataFim } = useParams();

    useEffect(() => {
        const request = async () => {
            const session = getSession();
            const response = await api.get("relatorioRetiradas", {
                params: {
                    dataInicio,
                    dataFim
                },
                headers: {
                    Authorization: `Bearer ${session.token}`
                }
            })

            if (response.data.error) {
                return;
            }

            setDados(response.data);
        }

        request();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PDFViewer width="100%" height={window.innerHeight + 'px'} onLoadError={(error) => alert('Error while loading document! ' + error.message)}>
            <Document
                title="Relatório de livros"
                onLoadError={(error) => alert('Error while loading document! ' + error.message)}
                style={{ padding: "2vh" }}
            >
                <Page size="A4" style={styles.page}>
                    <View style={styles.titulo}>
                        <Image src="assets/Logo2.png" style={styles.image} fixed={true} />
                        <Text style={{ fontSize: 30 }} fixed={true}>Relatório de Retiradas</Text>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.tableRow} fixed={true}>
                            <View style={[styles.tableCol, { width: "18vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>RA</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "50vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Nome</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "10vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Curso</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "15vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Semestre</Text>
                            </View>
                            <View style={[styles.tableCol, { width: "50vh", backgroundColor: "#ccc" }]}>
                                <Text style={styles.tableCell}>Livro</Text>
                            </View>
                        </View>
                        {dados.map((item, index) => {
                            return (
                                <>
                                    <View key={index} style={styles.tableRow}>
                                        <View style={[styles.tableCol, { width: "18vh" }]}>
                                            <Text style={styles.tableCell}>{item.ra}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "50vh" }]}>
                                            <Text style={styles.tableCell}>{item.nome}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "10vh" }]}>
                                            <Text style={styles.tableCell}>{item.curso}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "15vh" }]}>
                                            <Text style={styles.tableCell}>{item.semestre}</Text>
                                        </View>
                                        <View style={[styles.tableCol, { width: "50vh" }]}>
                                            <Text style={styles.tableCell}>{item.livro}</Text>
                                        </View>
                                    </View>
                                </>
                            )
                        })}
                    </View>
                </Page>
            </Document>
        </PDFViewer >
    )
}

export default Relatorio;