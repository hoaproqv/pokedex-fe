import Box from "@mui/material/Box";
import { FormProvider, FTextField } from "./form";
import Modal from "@mui/material/Modal";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  alpha,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { addPokemon, getPokemonById } from "../features/pokemons/pokemonSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { TYPESPKM, style, imageUrl } from "../global/variable";

//Schema
const schema = yup
  .object({
    name: yup.string().required(),
    id: yup.number().positive().integer().required(),
  })
  .required();

const defaultValues = {
  name: "",
  id: "",
  height: "",
  weight: "",
  attack: "",
  defense: "",
  hp: "",
  spAtk: "",
  spDef: "",
  speed: "",
  evolvesId: "",
  generation: "",
  hiddenAbility: "",
  ability1: "",
  ability2: "",
};

export default function PokemonModal({ open, setOpen }) {
  //useSelector
  const { isLoading } = useSelector((state) => state.pokemons);

  //useState
  const [type1, setType1] = useState("");
  const [type2, setType2] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  //useForm
  const methods = useForm({ defaultValues, resolver: yupResolver(schema) });
  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  //useRef
  const fileRef = useRef();

  //dispatch, navigate
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handle
  const handleSetType1 = (event) => {
    setType1(event.target.value);
  };

  const handleSetType2 = (event) => {
    setType2(event.target.value);
  };
  const handleClose = () => setOpen(false);

  const handleFileChange = (event) => {
    setSelectedFileName(event.target.files[0].name);
    const file = fileRef.current.files[0];
    if (file) {
      setValue("image", file);
    }
  };

  //useEffect
  useEffect(() => {
    if (type1 === type2) {
      setErrorStatus(true);
    } else {
      setErrorStatus(false);
    }
  }, [type1, type2]);

  //submit
  const onSubmit = (data) => {
    const {
      name,
      id,
      image,
      height,
      weight,
      attack,
      defense,
      hp,
      spAtk,
      spDef,
      speed,
      evolvesId,
      generation,
      hiddenAbility,
      ability1,
      ability2,
    } = data;

    getPokemonById(id);

    dispatch(
      addPokemon({
        name,
        id: String(id),
        image,
        types: [type1, type2],
        height,
        weight,
        attack,
        defense,
        hp,
        spAtk,
        spDef,
        speed,
        evolvesId,
        generation,
        hiddenAbility,
        abilities: [ability1, ability2],
      }),
    );

    setOpen(false);
    setTimeout(() => {
      navigate(`/pokemons/${id}`);
    }, 3000);
  };

  //other
  function firstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box spacing={2}>
              <Grid container spacing={1}>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="name"
                    fullWidth
                    rows={4}
                    placeholder="Name"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FTextField
                    name="id"
                    fullWidth
                    placeholder="Id Pokemon"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FormControl sx={{ minWidth: 195 }} error={!Boolean(type1)}>
                    <InputLabel>Type 1</InputLabel>
                    <Select
                      name="type1"
                      value={type1}
                      label="Type 1"
                      onChange={(event) => handleSetType1(event)}
                      sx={{
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "15.5px",
                          paddingBottom: "15.5px",
                        },
                      }}
                    >
                      {TYPESPKM.map((type) => (
                        <MenuItem value={type} key={type}>
                          <img
                            src={`${imageUrl}/TypesIcon/${type}.png`}
                            alt="type"
                            width="25px"
                            style={{ display: "inline-block", marginRight: 10 }}
                          />
                          {firstLetter(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} md={3}>
                  <FormControl
                    sx={{ minWidth: 195 }}
                    error={errorStatus || !Boolean(type2)}
                  >
                    <InputLabel>Type 2</InputLabel>
                    <Select
                      name="type2"
                      value={type2}
                      label="Type 2"
                      onChange={(event) => handleSetType2(event)}
                      sx={{
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          paddingTop: "15.5px",
                          paddingBottom: "15.5px",
                        },
                      }}
                    >
                      <MenuItem value="NA">N/A</MenuItem>
                      {TYPESPKM.map((type) => (
                        <MenuItem value={type} key={type}>
                          <img
                            src={`${imageUrl}/TypesIcon/${type}.png`}
                            alt="type"
                            width="25px"
                            style={{ display: "inline-block", marginRight: 10 }}
                          />
                          {firstLetter(type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={4} md={3}>
                  <label htmlFor="file-input">
                    <Button
                      variant="contained"
                      component="label"
                      style={{
                        width: 200,
                        height: 55,
                        backgroundColor: "white",
                        color: "grey",
                        display: "flex",
                        justifyContent: "flex-start",
                        boxShadow: "none",
                        border: "1px solid #DBE0E4",
                        textTransform: "none",
                        fontSize: 16,
                      }}
                    >
                      {selectedFileName || "Image Pokemon"}
                      <input
                        id="file-input"
                        type="file"
                        ref={fileRef}
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="ability1"
                    fullWidth
                    rows={4}
                    placeholder="Ability 1"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="ability2"
                    fullWidth
                    rows={4}
                    placeholder="Ability 2"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="hiddenAbility"
                    fullWidth
                    rows={4}
                    placeholder="Hidden Ability"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="height"
                    fullWidth
                    rows={4}
                    placeholder="Height"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="weight"
                    fullWidth
                    rows={4}
                    placeholder="Weight"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={4} md={3}>
                  <FTextField
                    name="generation"
                    fullWidth
                    rows={4}
                    placeholder="Generation"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="evolvesId"
                    fullWidth
                    rows={4}
                    placeholder="Evolves from"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="hp"
                    fullWidth
                    rows={4}
                    placeholder="HP"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="attack"
                    fullWidth
                    rows={4}
                    placeholder="Attack"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="defense"
                    fullWidth
                    rows={4}
                    placeholder="Defense"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="spAtk"
                    fullWidth
                    rows={4}
                    placeholder="Special Attack"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="spDef"
                    fullWidth
                    rows={4}
                    placeholder="Special Defense"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <FTextField
                    name="speed"
                    fullWidth
                    rows={4}
                    placeholder="Speed"
                    sx={{
                      "& fieldset": {
                        borderWidth: `1px !important`,
                        borderColor: alpha("#919EAB", 0.32),
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting || isLoading}
                >
                  Create Pokemon
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
