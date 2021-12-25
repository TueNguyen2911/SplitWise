import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material'
import Preview from './Preview'

const ExpenseForm = () => {
  const uploadBillImgRef = useRef()
  const [isBillForm, setIsBillForm] = useState(false)
  const [priceUser] = useState([
    {
      name: 'Tue',
      owned: 0
    },
    {
      name: 'Ga',
      owned: 0
    },
    {
      name: 'Dude',
      owned: 0
    }
  ])

  const [users] = useState([
    { name: 'Tue', avatar: 'https://images.sharp.com/doctors/Nguyen_Tue_56474_2012.jpg' },
    {
      name: 'Ga',
      avatar:
        'https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/Female_Portrait_1296x728-header-1296x729.jpg?w=1155&h=2268'
    },
    {
      name: 'Dude',
      avatar:
        'https://static.independent.co.uk/2020/10/30/08/newFile-2.jpg?width=640&auto=webp&quality=75'
    }
  ])
  const validationSchema = yup.object().shape({
    billDesc: yup.array().of(yup.string()),
    billPrice: yup.array().of(yup.number()),
    total: yup.number(),
    billImg: yup.object()
  })
  const initialValues = {
    billDesc: [''],
    billPrice: [0],
    billImg: null,
    total: 0
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    }
  })

  const clickUploadBill = () => {
    uploadBillImgRef.current.click()
  }
  const setImgValue = (e) => {
    console.log(e.target.files[0])
    formik.setValues({ ...formik.values, billImg: e.target.files[0] })
  }
  const handleDescChange = (e, index) => {
    const billDescArr = [...formik.values.billDesc]
    billDescArr[index] = e.target.value
    formik.setValues({ ...formik.values, billDesc: billDescArr })
  }
  const handlePriceChange = (e, index) => {
    const billPriceArr = [...formik.values.billPrice]
    billPriceArr[index] = Number(e.target.value)
    formik.setValues({ ...formik.values, billPrice: billPriceArr })
  }
  const editBillForm = (e, operation, index) => {
    const currLength = formik.values.billDesc.length

    const billDescArr = [...formik.values.billDesc]
    const billPriceArr = [...formik.values.billPrice]
    if (operation === 'add') {
      billDescArr[currLength] = ''
      billPriceArr[currLength] = 0
    } else if (operation === 'remove' && currLength > 1) {
      console.log(billPriceArr)
      billDescArr.splice(index, 1)
      console.log(billPriceArr.splice(index, 1))
      console.log(billPriceArr)
    }

    formik.setValues({ ...formik.values, billPrice: billPriceArr, billDesc: billDescArr })
  }
  const toggleBillForm = () => {
    formik.setValues(initialValues)
    setIsBillForm(!isBillForm)
  }
  const removeBillImg = () => {
    uploadBillImgRef.current.value = null
    formik.setValues({ ...formik.values, billImg: null, total: 0 })
  }
  useEffect(() => {
    console.log(formik.values)
    const locTotal = formik.values.billPrice.reduce((prev, curr) => prev + curr)
    const distributedprice = (locTotal / users.length).toFixed(2)
    formik.setValues({ ...formik.values, total: locTotal })
    priceUser.forEach((elem, index) => {
      elem.owned = distributedprice
    })
  }, [formik.values.billPrice])

  useEffect(() => {
    const distributedprice = (formik.values.total / users.length).toFixed(2)
    priceUser.forEach((elem, index) => {
      elem.owned = distributedprice
    })
  }, [formik.values.total])
  return (
    <form onSubmit={formik.handleSubmit} style={{ textAlign: 'left', margin: '10px 20px' }}>
      <Preview file={formik.values.billImg} removeBillImg={removeBillImg} />
      <Tooltip
        title={isBillForm ? 'Only the bill image or the bill form' : 'Upload a receipt image'}
        placement="right"
      >
        <span>
          <Button
            disabled={isBillForm}
            htmlFor="billImg"
            color="primary"
            variant="contained"
            onClick={clickUploadBill}
          >
            {formik.values.billImg ? 'Changed the bill image' : 'Upload the bill image'}
          </Button>
          <input
            name="billImg"
            id="billImg"
            ref={uploadBillImgRef}
            onChange={(e) => setImgValue(e)}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
          />
        </span>
      </Tooltip>
      <br /> <br />
      {formik.values.billImg ? (
        <>
          <label>Total: </label>
          <TextField
            name="total"
            id="total"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.total}
          />
        </>
      ) : null}
      <br /> <br />
      <Tooltip
        title={
          formik.values.billImg
            ? 'Only the bill image or the bill form'
            : 'Open a form table to enter bill details'
        }
        placement="right"
      >
        <span>
          <Button
            disabled={formik.values.billImg != null}
            color="primary"
            variant="contained"
            onClick={toggleBillForm}
          >
            {isBillForm ? 'Remove the bill table' : 'Enter the bill manually'}
          </Button>
        </span>
      </Tooltip>
      {isBillForm ? (
        <TableContainer>
          <Table sx={{ maxWidth: '60vw' }}>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {formik.values.billDesc
                ? formik.values.billDesc.map((elem, index) => (
                    <TableRow>
                      <TableCell>
                        <TextField
                          value={formik.values.billDesc[index]}
                          multiline
                          onChange={(e) => handleDescChange(e, index)}
                          sx={{ width: '40vw' }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          sx={{ width: '200px ' }}
                          value={formik.values.billPrice[index]}
                          onChange={(e) => handlePriceChange(e, index)}
                          type="number"
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={(e) => editBillForm(e, 'add')}>
                          <AddIcon />
                        </Button>
                        <Button onClick={(e) => editBillForm(e, 'remove', index)}>
                          <RemoveIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
              <label>Total: </label>
              <TextField
                InputProps={{
                  readOnly: true
                }}
                name="total"
                id="total"
                type="number"
                value={formik.values.total}
              />
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      <br /> <br />
      <TableContainer id="split-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Owned</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((elem, index) => (
              <TableRow>
                <TableCell>
                  <Avatar src={elem.avatar} /> {elem.name}
                </TableCell>
                <TableCell>
                  <TextField value={priceUser[index].owned} />
                </TableCell>
                <TableCell>
                  <TextField />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  )
}

export default ExpenseForm
